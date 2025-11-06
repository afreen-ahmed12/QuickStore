import Parse from '../config/parse';

// Authentication Services
export const authService = {
  async signUp(username, email, password) {
    const user = new Parse.User();
    user.set('username', username);
    user.set('email', email);
    user.set('password', password);
    
    try {
      const createdUser = await user.signUp();
      return {
        user: {
          id: createdUser.id,
          username: createdUser.get('username'),
          email: createdUser.get('email')
        },
        sessionToken: createdUser.getSessionToken()
      };
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  async logIn(email, password) {
    try {
      const user = await Parse.User.logIn(email, password);
      return {
        user: {
          id: user.id,
          username: user.get('username'),
          email: user.get('email')
        },
        sessionToken: user.getSessionToken()
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  async logOut() {
    try {
      await Parse.User.logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    return Parse.User.current();
  },

  async updateUser(data) {
    const user = Parse.User.current();
    if (!user) throw new Error('No user logged in');
    
    if (data.username) user.set('username', data.username);
    if (data.email) user.set('email', data.email);
    
    await user.save();
    return {
      id: user.id,
      username: user.get('username'),
      email: user.get('email')
    };
  }
};

// Items Service
export const itemsService = {
  async getAllItems(filters = {}) {
    const query = new Parse.Query('Item');
    query.equalTo('userId', Parse.User.current());
    
    if (filters.section && filters.section !== 'all') {
      query.equalTo('section', filters.section);
    }
    if (filters.folderId && filters.folderId !== 'all') {
      if (filters.folderId === 'none') {
        query.doesNotExist('folderId');
      } else {
        const Folder = Parse.Object.extend('Folder');
        const folder = new Folder();
        folder.id = filters.folderId;
        query.equalTo('folderId', folder);
      }
    }
    if (filters.type) {
      query.equalTo('type', filters.type);
    }
    
    query.include('folderId'); // Include folder data
    query.descending('createdAt');
    const results = await query.find();
    
    return results.map(item => {
      const folderId = item.get('folderId');
      return {
        _id: item.id,
        type: item.get('type'),
        title: item.get('title'),
        content: item.get('content') || '',
        url: item.get('url') || '',
        section: item.get('section'),
        folderId: folderId ? (folderId.id || folderId) : null,
        filePath: item.get('file')?.url() || '',
        fileName: item.get('fileName') || '',
        tags: item.get('tags') || [],
        createdAt: item.get('createdAt'),
        updatedAt: item.get('updatedAt')
      };
    });
  },

  async getItemById(id) {
    const query = new Parse.Query('Item');
    query.equalTo('userId', Parse.User.current());
    const item = await query.get(id);
    
    return {
      _id: item.id,
      type: item.get('type'),
      title: item.get('title'),
      content: item.get('content') || '',
      url: item.get('url') || '',
      section: item.get('section'),
      folderId: item.get('folderId')?.id || null,
      filePath: item.get('file')?.url() || '',
      fileName: item.get('fileName') || '',
      tags: item.get('tags') || [],
      createdAt: item.get('createdAt'),
      updatedAt: item.get('updatedAt')
    };
  },

  async createItem(data) {
    const Item = Parse.Object.extend('Item');
    const item = new Item();
    
    item.set('userId', Parse.User.current());
    item.set('type', data.type);
    item.set('title', data.title);
    item.set('content', data.content || '');
    item.set('url', data.url || '');
    item.set('section', data.section || 'general');
    item.set('tags', data.tags || []);
    
    if (data.folderId) {
      const Folder = Parse.Object.extend('Folder');
      const folder = new Folder();
      folder.id = data.folderId;
      item.set('folderId', folder);
    }
    
    await item.save();
    
    return {
      _id: item.id,
      type: item.get('type'),
      title: item.get('title'),
      content: item.get('content'),
      url: item.get('url'),
      section: item.get('section'),
      folderId: item.get('folderId')?.id || null,
      tags: item.get('tags'),
      createdAt: item.get('createdAt'),
      updatedAt: item.get('updatedAt')
    };
  },

  async uploadFile(file, data) {
    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();
    
    const Item = Parse.Object.extend('Item');
    const item = new Item();
    
    item.set('userId', Parse.User.current());
    item.set('type', 'file');
    item.set('title', data.title || file.name);
    item.set('file', parseFile);
    item.set('fileName', file.name);
    item.set('section', data.section || 'general');
    item.set('tags', data.tags || []);
    
    if (data.folderId) {
      const Folder = Parse.Object.extend('Folder');
      const folder = new Folder();
      folder.id = data.folderId;
      item.set('folderId', folder);
    }
    
    await item.save();
    
    return {
      _id: item.id,
      type: item.get('type'),
      title: item.get('title'),
      fileName: item.get('fileName'),
      filePath: item.get('file').url(),
      section: item.get('section'),
      folderId: item.get('folderId')?.id || null,
      tags: item.get('tags'),
      createdAt: item.get('createdAt')
    };
  },

  async updateItem(id, data) {
    const query = new Parse.Query('Item');
    query.equalTo('userId', Parse.User.current());
    const item = await query.get(id);
    
    if (data.title) item.set('title', data.title);
    if (data.content !== undefined) item.set('content', data.content);
    if (data.url !== undefined) item.set('url', data.url);
    if (data.section) item.set('section', data.section);
    if (data.tags) item.set('tags', data.tags);
    
    if (data.folderId !== undefined) {
      if (data.folderId) {
        const Folder = Parse.Object.extend('Folder');
        const folder = new Folder();
        folder.id = data.folderId;
        item.set('folderId', folder);
      } else {
        item.unset('folderId');
      }
    }
    
    item.set('updatedAt', new Date());
    await item.save();
    
    return {
      _id: item.id,
      type: item.get('type'),
      title: item.get('title'),
      content: item.get('content'),
      url: item.get('url'),
      section: item.get('section'),
      folderId: item.get('folderId')?.id || null,
      tags: item.get('tags'),
      createdAt: item.get('createdAt'),
      updatedAt: item.get('updatedAt')
    };
  },

  async deleteItem(id) {
    const query = new Parse.Query('Item');
    query.equalTo('userId', Parse.User.current());
    const item = await query.get(id);
    await item.destroy();
  }
};

// Folders Service
export const foldersService = {
  async getAllFolders() {
    const query = new Parse.Query('Folder');
    query.equalTo('userId', Parse.User.current());
    query.descending('createdAt');
    const results = await query.find();
    
    return results.map(folder => ({
      _id: folder.id,
      name: folder.get('name'),
      description: folder.get('description') || '',
      color: folder.get('color') || '#6366f1',
      createdAt: folder.get('createdAt'),
      updatedAt: folder.get('updatedAt')
    }));
  },

  async getFolderById(id) {
    const query = new Parse.Query('Folder');
    query.equalTo('userId', Parse.User.current());
    const folder = await query.get(id);
    
    return {
      _id: folder.id,
      name: folder.get('name'),
      description: folder.get('description') || '',
      color: folder.get('color') || '#6366f1',
      createdAt: folder.get('createdAt'),
      updatedAt: folder.get('updatedAt')
    };
  },

  async createFolder(data) {
    const Folder = Parse.Object.extend('Folder');
    const folder = new Folder();
    
    folder.set('userId', Parse.User.current());
    folder.set('name', data.name);
    folder.set('description', data.description || '');
    folder.set('color', data.color || '#6366f1');
    
    await folder.save();
    
    return {
      _id: folder.id,
      name: folder.get('name'),
      description: folder.get('description'),
      color: folder.get('color'),
      createdAt: folder.get('createdAt'),
      updatedAt: folder.get('updatedAt')
    };
  },

  async updateFolder(id, data) {
    const query = new Parse.Query('Folder');
    query.equalTo('userId', Parse.User.current());
    const folder = await query.get(id);
    
    if (data.name) folder.set('name', data.name);
    if (data.description !== undefined) folder.set('description', data.description);
    if (data.color) folder.set('color', data.color);
    
    folder.set('updatedAt', new Date());
    await folder.save();
    
    return {
      _id: folder.id,
      name: folder.get('name'),
      description: folder.get('description'),
      color: folder.get('color'),
      createdAt: folder.get('createdAt'),
      updatedAt: folder.get('updatedAt')
    };
  },

  async deleteFolder(id) {
    const query = new Parse.Query('Folder');
    query.equalTo('userId', Parse.User.current());
    const folder = await query.get(id);
    await folder.destroy();
  }
};

