export interface Env {
  D1_DB: any;
}

const json = (body: any, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function hashPassword(password: string) {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    try {
      // POST /api/auth  (register or login)
      if (request.method === 'POST' && pathname === '/api/auth') {
        const body = await request.json().catch(() => ({}));
        const username = String(body.username || '').trim();
        const password = String(body.password || '');

        if (!username || !password) return json({ success: false, message: 'Fill in all the fields' }, 400);
        if (username.length < 3) return json({ success: false, message: 'Username must be at least 3 characters' }, 400);
        if (password.length < 6) return json({ success: false, message: 'Password must be at least 6 characters' }, 400);

        // Check existing user
        const exists = await env.D1_DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).all();
        const row = exists.results && exists.results[0];
        const pwHash = await hashPassword(password);

        if (row) {
          // login flow
          if ((row as any).password === pwHash) {
            return json({ success: true, message: 'Welcome home', redirect: '/profile', user: { id: row.id, username: row.username } });
          } else {
            return json({ success: false, message: 'Incorrect password' }, 401);
          }
        }

        // register
        const insert = await env.D1_DB.prepare('INSERT INTO users (username, password, bio, year, created_at) VALUES (?, ?, ?, ?, strftime("%s","now"))').bind(username, pwHash, 'The new users THEGRAPE', null).run();
        const id = insert.lastInsertRowId || null;
        return json({ success: true, message: 'Account created', redirect: '/profile', user: { id, username } });
      }

      // GET /api/user/:id
      const userGet = pathname.match(/^\/api\/user\/(\d+)$/);
      if (request.method === 'GET' && userGet) {
        const id = Number(userGet[1]);
        const result = await env.D1_DB.prepare('SELECT id, username, bio, year FROM users WHERE id = ?').bind(id).all();
        const user = result.results && result.results[0];
        if (!user) return json({ success: false, error: 'USER_NOT_FOUND' }, 404);
        return json({ success: true, user });
      }

      // POST /api/user/:id  (update)
      if (request.method === 'POST' && pathname.match(/^\/api\/user\/(\d+)$/)) {
        const m = pathname.match(/^\/api\/user\/(\d+)$/);
        const id = Number(m && m[1]);
        const body = await request.json().catch(() => ({}));

        // basic validation when present
        if (body.username && String(body.username).trim().length < 3) return json({ success: false, message: 'Username must be at least 3 characters' }, 400);
        if (body.password && String(body.password).length < 6) return json({ success: false, message: 'Password must be at least 6 characters' }, 400);

        const fields: string[] = [];
        const values: any[] = [];
        if (body.username) { fields.push('username = ?'); values.push(String(body.username).trim()); }
        if (body.bio !== undefined) { fields.push('bio = ?'); values.push(String(body.bio)); }
        if (body.year !== undefined) { fields.push('year = ?'); values.push(Number(body.year)); }
        if (body.password) { const h = await hashPassword(String(body.password)); fields.push('password = ?'); values.push(h); }

        if (fields.length === 0) return json({ success: false, message: 'No fields to update' }, 400);

        values.push(id);
        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const r = await env.D1_DB.prepare(sql).bind(...values).run();
        if (r && r.success === false) return json({ success: false, message: 'Update failed' }, 500);
        const updated = await env.D1_DB.prepare('SELECT id, username, bio, year FROM users WHERE id = ?').bind(id).all();
        return json({ success: true, user: updated.results && updated.results[0] });
      }

      // GET /api/posts (list)
      if (request.method === 'GET' && pathname === '/api/posts') {
        const res = await env.D1_DB.prepare('SELECT p.id, p.text, p.time, p.author_id as author FROM posts p ORDER BY p.time DESC').all();
        return json({ success: true, posts: res.results || [] });
      }

      // POST /api/posts
      if (request.method === 'POST' && pathname === '/api/posts') {
        const body = await request.json().catch(() => ({}));
        const author = Number(body.author || body.author_id);
        const text = String(body.text || '').trim();
        if (!author || !text) return json({ success: false, message: 'author and text required' }, 400);
        const insert = await env.D1_DB.prepare('INSERT INTO posts (author_id, text, time) VALUES (?, ?, strftime("%s","now"))').bind(author, text).run();
        const id = insert.lastInsertRowId || null;
        return json({ success: true, post: { id, author, text, time: Date.now() } });
      }
      // GET /api/chat/:id  -> returns messages where from or to = id
      const chatMatch = pathname.match(/^\/api\/chat\/(\d+)$/);
      if (request.method === 'GET' && chatMatch) {
        const id = Number(chatMatch[1]);
        const rows = await env.D1_DB.prepare('SELECT id, "from" as from_id, "to" as to_id, text, time FROM messages WHERE "from" = ? OR "to" = ? ORDER BY time ASC').bind(id, id).all();
        return json({ success: true, messages: rows.results || [] });
      }

      // POST /api/chat/send
      if (request.method === 'POST' && pathname === '/api/chat/send') {
        const body = await request.json().catch(() => ({}));
        const from = Number(body.from);
        const to = Number(body.to);
        const text = String(body.text || '').trim();
        if (!from || !to || !text) return json({ success: false, message: 'from,to,text required' }, 400);
        const insert = await env.D1_DB.prepare('INSERT INTO messages ("from", "to", text, time) VALUES (?, ?, ?, strftime("%s","now"))').bind(from, to, text).run();
        const id = insert.lastInsertRowId || null;
        return json({ success: true, message: { id, from, to, text, time: Date.now() } });
      }

      // GET /api/friends/:id -> list friend ids
      const friendsMatch = pathname.match(/^\/api\/friends\/(\d+)$/);
      if (request.method === 'GET' && friendsMatch) {
        const id = Number(friendsMatch[1]);
        const rows = await env.D1_DB.prepare('SELECT friend_id FROM friends WHERE user_id = ?').bind(id).all();
        const list = (rows.results || []).map((r: any) => r.friend_id);
        return json({ success: true, friends: list });
      }

      // POST /api/friends/add
      if (request.method === 'POST' && pathname === '/api/friends/add') {
        const body = await request.json().catch(() => ({}));
        const user_id = Number(body.user_id);
        const friend_id = Number(body.friend_id);
        if (!user_id || !friend_id) return json({ success: false, message: 'user_id and friend_id required' }, 400);
        try {
          await env.D1_DB.prepare('INSERT OR IGNORE INTO friends (user_id, friend_id) VALUES (?, ?)').bind(user_id, friend_id).run();
          return json({ success: true });
        } catch (err) {
          return json({ success: false, error: String(err) }, 500);
        }
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      return json({ success: false, error: String(err) }, 500);
    }

  }
};

