// QuickStore - Parse Cloud Code
// Backend security, validation, and business logic

// ============================================
// SECURITY & VALIDATION HOOKS
// ============================================

// User validation and security
Parse.Cloud.beforeSave(Parse.User, async (request) => {
    const user = request.object;
    
    // Email validation
    if (user.isNew() || user.dirty('email')) {
        const email = user.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Parse.Error(Parse.Error.INVALID_EMAIL_ADDRESS, 'Invalid email address');
        }
    }
    
    // Username validation
    if (user.isNew() || user.dirty('username')) {
        const username = user.get('username');
        if (username.length < 3 || username.length > 30) {
            throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Username must be between 3 and 30 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Username can only contain letters, numbers, and underscores');
        }
    }
    
    // Password strength validation
    if (user.isNew() || user.dirty('password')) {
        const password = user.get('password');
        if (password && password.length < 8) {
            throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Password must be at least 8 characters');
        }
    }
    
    // Set default role
    if (user.isNew()) {
        user.set('role', 'user');
        user.set('isEmailVerified', false);
        user.set('isActive', true);
        user.set('lastLogin', null);
        user.set('loginAttempts', 0);
        user.set('accountCreated', new Date());
    }
    
    return true;
});

// Item validation and security
Parse.Cloud.beforeSave('Item', async (request) => {
    const item = request.object;
    const user = request.user;
    
    // Authentication check
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in to create items');
    }
    
    // Ownership validation
    if (!item.isNew()) {
        const existingItem = await new Parse.Query('Item').get(item.id, { useMasterKey: true });
        if (existingItem.get('user').id !== user.id) {
            throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only modify your own items');
        }
    }
    
    // Set user if new
    if (item.isNew()) {
        item.set('user', user);
    }
    
    // Title validation
    const title = item.get('title');
    if (!title || title.trim().length === 0) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Title is required');
    }
    if (title.length > 200) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Title must be less than 200 characters');
    }
    
    // Content validation
    const content = item.get('content');
    if (!content || content.trim().length === 0) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Content is required');
    }
    if (content.length > 10000) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Content must be less than 10000 characters');
    }
    
    // Type validation
    const validTypes = ['link', 'file', 'message'];
    const type = item.get('type');
    if (!validTypes.includes(type)) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid item type');
    }
    
    // URL validation for links
    if (type === 'link') {
        try {
            new URL(content);
        } catch (e) {
            throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid URL format');
        }
    }
    
    // Sanitize tags
    const tags = item.get('tags') || [];
    if (Array.isArray(tags)) {
        const sanitizedTags = tags
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0 && tag.length <= 30)
            .slice(0, 10); // Max 10 tags
        item.set('tags', sanitizedTags);
    }
    
    // Set timestamps
    if (item.isNew()) {
        item.set('createdAt', new Date());
    }
    item.set('updatedAt', new Date());
    
    return true;
});

// Folder validation and security
Parse.Cloud.beforeSave('Folder', async (request) => {
    const folder = request.object;
    const user = request.user;
    
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    if (!folder.isNew()) {
        const existingFolder = await new Parse.Query('Folder').get(folder.id, { useMasterKey: true });
        if (existingFolder.get('user').id !== user.id) {
            throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only modify your own folders');
        }
    }
    
    if (folder.isNew()) {
        folder.set('user', user);
    }
    
    const name = folder.get('name');
    if (!name || name.trim().length === 0) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Folder name is required');
    }
    if (name.length > 100) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Folder name must be less than 100 characters');
    }
    
    // Check for duplicate folder names
    const query = new Parse.Query('Folder');
    query.equalTo('user', user);
    query.equalTo('name', name.trim());
    if (!folder.isNew()) {
        query.notEqualTo('objectId', folder.id);
    }
    const existing = await query.first({ useMasterKey: true });
    if (existing) {
        throw new Parse.Error(Parse.Error.DUPLICATE_VALUE, 'Folder name already exists');
    }
    
    folder.set('name', name.trim());
    if (folder.isNew()) {
        folder.set('createdAt', new Date());
    }
    folder.set('updatedAt', new Date());
    
    return true;
});

// Delete validation
Parse.Cloud.beforeDelete('Item', async (request) => {
    const item = request.object;
    const user = request.user;
    
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    if (item.get('user').id !== user.id) {
        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only delete your own items');
    }
    
    return true;
});

Parse.Cloud.beforeDelete('Folder', async (request) => {
    const folder = request.object;
    const user = request.user;
    
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    if (folder.get('user').id !== user.id) {
        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only delete your own folders');
    }
    
    return true;
});

// ============================================
// ACTIVITY LOGGING
// ============================================

async function logActivity(user, action, details = {}) {
    const Activity = Parse.Object.extend('Activity');
    const activity = new Activity();
    activity.set('user', user);
    activity.set('action', action);
    activity.set('details', details);
    activity.set('timestamp', new Date());
    activity.set('ipAddress', details.ipAddress || 'unknown');
    await activity.save(null, { useMasterKey: true });
}

// Log after item creation
Parse.Cloud.afterSave('Item', async (request) => {
    if (request.object.isNew()) {
        await logActivity(request.user, 'item_created', {
            itemId: request.object.id,
            itemType: request.object.get('type'),
            itemTitle: request.object.get('title')
        });
    } else {
        await logActivity(request.user, 'item_updated', {
            itemId: request.object.id
        });
    }
});

// Log after item deletion
Parse.Cloud.afterDelete('Item', async (request) => {
    await logActivity(request.user, 'item_deleted', {
        itemId: request.object.id
    });
});

// Log after folder creation
Parse.Cloud.afterSave('Folder', async (request) => {
    if (request.object.isNew()) {
        await logActivity(request.user, 'folder_created', {
            folderId: request.object.id,
            folderName: request.object.get('name')
        });
    }
});

// ============================================
// CLOUD FUNCTIONS
// ============================================

// Get user statistics
Parse.Cloud.define('getUserStats', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    const Item = Parse.Object.extend('Item');
    const Folder = Parse.Object.extend('Folder');
    
    const itemQuery = new Parse.Query(Item);
    itemQuery.equalTo('user', user);
    
    const folderQuery = new Parse.Query(Folder);
    folderQuery.equalTo('user', user);
    
    const [totalItems, totalFolders, itemsByType, favoriteItems] = await Promise.all([
        itemQuery.count({ useMasterKey: true }),
        folderQuery.count({ useMasterKey: true }),
        itemQuery.find({ useMasterKey: true }),
        itemQuery.equalTo('isFavorite', true).count({ useMasterKey: true })
    ]);
    
    const typeCounts = {
        link: 0,
        file: 0,
        message: 0
    };
    
    itemsByType.forEach(item => {
        const type = item.get('type');
        if (typeCounts[type] !== undefined) {
            typeCounts[type]++;
        }
    });
    
    return {
        totalItems,
        totalFolders,
        totalLinks: typeCounts.link,
        totalFiles: typeCounts.file,
        totalMessages: typeCounts.message,
        totalFavorites: favoriteItems
    };
});

// Search items with advanced filtering
Parse.Cloud.define('searchItems', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    const { query: searchQuery, type, folderId, tags, isFavorite, limit = 50, skip = 0 } = request.params;
    
    const Item = Parse.Object.extend('Item');
    const query = new Parse.Query(Item);
    query.equalTo('user', user);
    
    if (searchQuery && searchQuery.trim().length > 0) {
        query.matches('title', searchQuery, 'i');
        const contentQuery = new Parse.Query(Item);
        contentQuery.equalTo('user', user);
        contentQuery.matches('content', searchQuery, 'i');
        query = Parse.Query.or(query, contentQuery);
    }
    
    if (type) {
        query.equalTo('type', type);
    }
    
    if (folderId) {
        const folder = Parse.Object.createWithoutData('Folder', folderId);
        query.equalTo('folder', folder);
    }
    
    if (tags && Array.isArray(tags) && tags.length > 0) {
        query.containsAll('tags', tags);
    }
    
    if (isFavorite !== undefined) {
        query.equalTo('isFavorite', isFavorite);
    }
    
    query.limit(Math.min(limit, 100)); // Max 100 items
    query.skip(skip);
    query.descending('createdAt');
    query.include('folder');
    
    const results = await query.find({ useMasterKey: true });
    return results.map(item => ({
        id: item.id,
        type: item.get('type'),
        title: item.get('title'),
        content: item.get('content'),
        tags: item.get('tags') || [],
        isFavorite: item.get('isFavorite') || false,
        folder: item.get('folder') ? {
            id: item.get('folder').id,
            name: item.get('folder').get('name')
        } : null,
        createdAt: item.get('createdAt'),
        updatedAt: item.get('updatedAt')
    }));
});

// Export user data (GDPR compliance)
Parse.Cloud.define('exportUserData', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    const Item = Parse.Object.extend('Item');
    const Folder = Parse.Object.extend('Folder');
    const Activity = Parse.Object.extend('Activity');
    
    const [items, folders, activities] = await Promise.all([
        new Parse.Query(Item).equalTo('user', user).find({ useMasterKey: true }),
        new Parse.Query(Folder).equalTo('user', user).find({ useMasterKey: true }),
        new Parse.Query(Activity).equalTo('user', user).limit(1000).find({ useMasterKey: true })
    ]);
    
    return {
        user: {
            id: user.id,
            username: user.get('username'),
            email: user.get('email'),
            createdAt: user.get('createdAt'),
            accountCreated: user.get('accountCreated')
        },
        items: items.map(item => ({
            id: item.id,
            type: item.get('type'),
            title: item.get('title'),
            content: item.get('content'),
            tags: item.get('tags') || [],
            isFavorite: item.get('isFavorite') || false,
            createdAt: item.get('createdAt'),
            updatedAt: item.get('updatedAt')
        })),
        folders: folders.map(folder => ({
            id: folder.id,
            name: folder.get('name'),
            createdAt: folder.get('createdAt'),
            updatedAt: folder.get('updatedAt')
        })),
        activities: activities.map(activity => ({
            action: activity.get('action'),
            details: activity.get('details'),
            timestamp: activity.get('timestamp')
        })),
        exportDate: new Date()
    };
});

// Delete user account and all data
Parse.Cloud.define('deleteAccount', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    const { confirmation } = request.params;
    if (confirmation !== 'DELETE') {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Confirmation required');
    }
    
    // Delete all user's items
    const Item = Parse.Object.extend('Item');
    const itemQuery = new Parse.Query(Item);
    itemQuery.equalTo('user', user);
    const items = await itemQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(items, { useMasterKey: true });
    
    // Delete all user's folders
    const Folder = Parse.Object.extend('Folder');
    const folderQuery = new Parse.Query(Folder);
    folderQuery.equalTo('user', user);
    const folders = await folderQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(folders, { useMasterKey: true });
    
    // Delete all user's activities
    const Activity = Parse.Object.extend('Activity');
    const activityQuery = new Parse.Query(Activity);
    activityQuery.equalTo('user', user);
    const activities = await activityQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(activities, { useMasterKey: true });
    
    // Delete user account
    await user.destroy({ useMasterKey: true });
    
    return { success: true, message: 'Account and all data deleted successfully' };
});

// Rate limiting helper
const rateLimitMap = new Map();

function checkRateLimit(userId, action, maxRequests = 10, windowMs = 60000) {
    const key = `${userId}_${action}`;
    const now = Date.now();
    const userLimits = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > userLimits.resetTime) {
        userLimits.count = 0;
        userLimits.resetTime = now + windowMs;
    }
    
    if (userLimits.count >= maxRequests) {
        throw new Parse.Error(Parse.Error.TOO_MANY_REQUESTS, 'Rate limit exceeded. Please try again later.');
    }
    
    userLimits.count++;
    rateLimitMap.set(key, userLimits);
    
    return true;
}

// Apply rate limiting to search
Parse.Cloud.beforeSave('Item', async (request) => {
    const user = request.user;
    if (user) {
        checkRateLimit(user.id, 'item_save', 20, 60000); // 20 items per minute
    }
});

// ============================================
// EMAIL VERIFICATION
// ============================================

Parse.Cloud.define('sendVerificationEmail', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    // Generate verification token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    user.set('emailVerificationToken', token);
    user.set('emailVerificationExpiry', new Date(Date.now() + 24 * 60 * 60 * 1000)); // 24 hours
    await user.save(null, { useMasterKey: true });
    
    // In production, send email using email service
    // For now, return token (in production, send via email)
    return {
        message: 'Verification email sent',
        token: token // Remove in production
    };
});

Parse.Cloud.define('verifyEmail', async (request) => {
    const { token } = request.params;
    const user = request.user;
    
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    if (user.get('emailVerificationToken') !== token) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid verification token');
    }
    
    const expiry = user.get('emailVerificationExpiry');
    if (new Date() > expiry) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Verification token expired');
    }
    
    user.set('isEmailVerified', true);
    user.unset('emailVerificationToken');
    user.unset('emailVerificationExpiry');
    await user.save(null, { useMasterKey: true });
    
    await logActivity(user, 'email_verified', {});
    
    return { success: true, message: 'Email verified successfully' };
});

// ============================================
// PASSWORD RESET
// ============================================

Parse.Cloud.define('requestPasswordReset', async (request) => {
    const { email } = request.params;
    
    const query = new Parse.Query(Parse.User);
    query.equalTo('email', email);
    const user = await query.first({ useMasterKey: true });
    
    if (!user) {
        // Don't reveal if user exists for security
        return { message: 'If an account exists with this email, a password reset link has been sent' };
    }
    
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    user.set('passwordResetToken', token);
    user.set('passwordResetExpiry', new Date(Date.now() + 60 * 60 * 1000)); // 1 hour
    await user.save(null, { useMasterKey: true });
    
    // In production, send email with reset link
    return {
        message: 'Password reset email sent',
        token: token // Remove in production
    };
});

Parse.Cloud.define('resetPassword', async (request) => {
    const { token, newPassword } = request.params;
    
    if (!token || !newPassword) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Token and new password are required');
    }
    
    if (newPassword.length < 8) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Password must be at least 8 characters');
    }
    
    const query = new Parse.Query(Parse.User);
    query.equalTo('passwordResetToken', token);
    const user = await query.first({ useMasterKey: true });
    
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid reset token');
    }
    
    const expiry = user.get('passwordResetExpiry');
    if (new Date() > expiry) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Reset token expired');
    }
    
    user.set('password', newPassword);
    user.unset('passwordResetToken');
    user.unset('passwordResetExpiry');
    await user.save(null, { useMasterKey: true });
    
    await logActivity(user, 'password_reset', {});
    
    return { success: true, message: 'Password reset successfully' };
});

// ============================================
// SHARING & COLLABORATION
// ============================================

Parse.Cloud.define('shareItem', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    const { itemId, shareWithUserId, permission = 'read' } = request.params;
    
    if (!['read', 'write'].includes(permission)) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Invalid permission type');
    }
    
    const Item = Parse.Object.extend('Item');
    const item = await new Parse.Query(Item).get(itemId, { useMasterKey: true });
    
    if (item.get('user').id !== user.id) {
        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'You can only share your own items');
    }
    
    const Share = Parse.Object.extend('Share');
    const share = new Share();
    share.set('item', item);
    share.set('sharedBy', user);
    share.set('sharedWith', Parse.Object.createWithoutData('_User', shareWithUserId));
    share.set('permission', permission);
    share.set('createdAt', new Date());
    await share.save(null, { useMasterKey: true });
    
    await logActivity(user, 'item_shared', {
        itemId: itemId,
        sharedWith: shareWithUserId,
        permission: permission
    });
    
    return { success: true, message: 'Item shared successfully' };
});

// ============================================
// WEBHOOKS (for external integrations)
// ============================================

Parse.Cloud.define('createWebhook', async (request) => {
    const user = request.user;
    if (!user) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'You must be logged in');
    }
    
    const { url, events } = request.params;
    
    if (!url || !events || !Array.isArray(events)) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, 'URL and events array are required');
    }
    
    const Webhook = Parse.Object.extend('Webhook');
    const webhook = new Webhook();
    webhook.set('user', user);
    webhook.set('url', url);
    webhook.set('events', events);
    webhook.set('isActive', true);
    webhook.set('createdAt', new Date());
    await webhook.save(null, { useMasterKey: true });
    
    return { success: true, webhookId: webhook.id };
});

// ============================================
// ADMIN FUNCTIONS
// ============================================

Parse.Cloud.define('getSystemStats', async (request) => {
    const user = request.user;
    if (!user || user.get('role') !== 'admin') {
        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Admin access required');
    }
    
    const [totalUsers, totalItems, totalFolders] = await Promise.all([
        new Parse.Query(Parse.User).count({ useMasterKey: true }),
        new Parse.Query('Item').count({ useMasterKey: true }),
        new Parse.Query('Folder').count({ useMasterKey: true })
    ]);
    
    return {
        totalUsers,
        totalItems,
        totalFolders,
        timestamp: new Date()
    };
});

