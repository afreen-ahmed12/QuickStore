// QuickStore - Main JavaScript File with Parse Server Integration

// Global variables
let currentUser = null;
let allItems = [];
let allFolders = [];
let searchQuery = '';
let currentFilter = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application based on current page
async function initializeApp() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check current user
    currentUser = Parse.User.current();
    
    if (currentPage === 'index.html' || currentPage === '') {
        if (currentUser) {
            window.location.href = 'home.html';
        } else {
            initializeAuth();
        }
    } else if (currentPage === 'home.html') {
        await checkAuth();
        await initializeHome();
    } else if (currentPage === 'mysetting.html') {
        await checkAuth();
        await initializeSettings();
    } else if (currentPage === 'contact.html') {
        await checkAuth();
        initializeContact();
    } else if (currentPage === 'logout.html') {
        handleLogout();
    } else {
        await checkAuth();
        initializeNavbar();
    }
    
    // Initialize theme
    initializeTheme();
}

// Authentication Functions
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

async function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!username || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const user = new Parse.User();
        user.set('username', username);
        user.set('email', email);
        user.set('password', password);
        
        await user.signUp();
        showNotification('Account created successfully!', 'success');
        window.location.href = 'home.html';
    } catch (error) {
        showNotification(error.message || 'Signup failed. Please try again.', 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    try {
        await Parse.User.logIn(username, password);
        showNotification('Login successful!', 'success');
        window.location.href = 'home.html';
    } catch (error) {
        showNotification('Invalid username or password', 'error');
    }
}

async function handleLogout() {
    try {
        await Parse.User.logOut();
        currentUser = null;
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'index.html';
    }
}

async function checkAuth() {
    currentUser = Parse.User.current();
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Home Page Functions
async function initializeHome() {
    initializeNavbar();
    await loadFolders();
    await loadItems();
    setupItemForm();
    setupFolderForm();
    setupFilter();
    
    // Update welcome message
    if (currentUser && document.getElementById('welcomeUser')) {
        document.getElementById('welcomeUser').textContent = `Welcome back, ${currentUser.get('username')}!`;
    }
}

function setupItemForm() {
    const itemType = document.getElementById('itemType');
    const urlGroup = document.getElementById('urlGroup');
    const fileGroup = document.getElementById('fileGroup');
    const messageGroup = document.getElementById('messageGroup');
    const addItemForm = document.getElementById('addItemForm');
    
    if (itemType) {
        itemType.addEventListener('change', function() {
            const type = this.value;
            if (urlGroup) urlGroup.style.display = type === 'link' ? 'block' : 'none';
            if (fileGroup) fileGroup.style.display = type === 'file' ? 'block' : 'none';
            if (messageGroup) messageGroup.style.display = type === 'message' ? 'block' : 'none';
        });
    }
    
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addItem();
        });
    }
}

function setupFolderForm() {
    const addFolderForm = document.getElementById('addFolderForm');
    if (addFolderForm) {
        addFolderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addFolder();
        });
    }
}

function setupFilter() {
    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            currentFilter = this.value;
            filterItems();
        });
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchQuery = searchInput.value.toLowerCase().trim();
        filterItems();
    }
}

function openAddModal() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.classList.add('active');
        loadFoldersIntoSelect();
    }
}

function closeAddModal() {
    const modal = document.getElementById('addModal');
    if (modal) {
        modal.classList.remove('active');
        const form = document.getElementById('addItemForm');
        if (form) {
            form.reset();
            // Reset submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Add Item';
                submitBtn.onclick = null;
                form.onsubmit = function(e) {
                    e.preventDefault();
                    addItem();
                };
            }
            // Reset form visibility
            const urlGroup = document.getElementById('urlGroup');
            const fileGroup = document.getElementById('fileGroup');
            const messageGroup = document.getElementById('messageGroup');
            if (urlGroup) urlGroup.style.display = 'block';
            if (fileGroup) fileGroup.style.display = 'none';
            if (messageGroup) messageGroup.style.display = 'none';
        }
    }
}

function openFolderModal() {
    const modal = document.getElementById('folderModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeFolderModal() {
    const modal = document.getElementById('folderModal');
    if (modal) {
        modal.classList.remove('active');
        const form = document.getElementById('addFolderForm');
        if (form) form.reset();
    }
}

async function addItem() {
    if (!currentUser) return;
    
    const type = document.getElementById('itemType').value;
    const title = document.getElementById('itemTitle').value.trim();
    const folderId = document.getElementById('itemFolder').value;
    const tags = document.getElementById('itemTags').value.trim();
    const isFavorite = document.getElementById('itemFavorite').checked;
    const fileInput = document.getElementById('itemFileUpload');
    
    if (!title) {
        showNotification('Please enter a title', 'error');
        return;
    }
    
    let content = '';
    if (type === 'link') {
        content = document.getElementById('itemUrl').value.trim();
        if (!content) {
            showNotification('Please enter a URL', 'error');
            return;
        }
    } else if (type === 'file') {
        content = document.getElementById('itemFile').value.trim();
        if (!content && !fileInput.files[0]) {
            showNotification('Please enter file information or upload a file', 'error');
            return;
        }
    } else if (type === 'message') {
        content = document.getElementById('itemMessage').value.trim();
        if (!content) {
            showNotification('Please enter a message', 'error');
            return;
        }
    }
    
    try {
        const Item = Parse.Object.extend('Item');
        const item = new Item();
        
        item.set('user', currentUser);
        item.set('type', type);
        item.set('title', title);
        item.set('content', content);
        item.set('isFavorite', isFavorite);
        item.set('tags', tags ? tags.split(',').map(t => t.trim()) : []);
        
        if (folderId) {
            const folderPointer = Parse.Object.createWithoutData('Folder', folderId);
            item.set('folder', folderPointer);
        }
        
        // Handle file upload
        if (fileInput && fileInput.files[0]) {
            const file = fileInput.files[0];
            const parseFile = new Parse.File(file.name, file);
            await parseFile.save();
            item.set('file', parseFile);
            item.set('fileName', file.name);
        }
        
        await item.save();
        
        closeAddModal();
        await loadItems();
        showNotification('Item added successfully!', 'success');
    } catch (error) {
        showNotification('Failed to add item: ' + error.message, 'error');
    }
}

async function addFolder() {
    if (!currentUser) return;
    
    const folderName = document.getElementById('folderName').value.trim();
    
    if (!folderName) {
        showNotification('Please enter a folder name', 'error');
        return;
    }
    
    try {
        // Check if folder already exists
        const Folder = Parse.Object.extend('Folder');
        const query = new Parse.Query(Folder);
        query.equalTo('user', currentUser);
        query.equalTo('name', folderName);
        const existing = await query.first();
        
        if (existing) {
            showNotification('Folder name already exists', 'error');
            return;
        }
        
        const folder = new Folder();
        folder.set('user', currentUser);
        folder.set('name', folderName);
        
        await folder.save();
        
        closeFolderModal();
        await loadFolders();
        await loadItems();
        showNotification('Folder created successfully!', 'success');
    } catch (error) {
        showNotification('Failed to create folder: ' + error.message, 'error');
    }
}

async function loadItems() {
    if (!currentUser) return;
    
    try {
        const Item = Parse.Object.extend('Item');
        const query = new Parse.Query(Item);
        query.equalTo('user', currentUser);
        query.include('folder');
        query.descending('createdAt');
        
        allItems = await query.find();
        filterItems();
    } catch (error) {
        console.error('Error loading items:', error);
        showNotification('Failed to load items', 'error');
    }
}

function filterItems() {
    const itemsGrid = document.getElementById('itemsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!itemsGrid) return;
    
    itemsGrid.innerHTML = '';
    
    let itemsToShow = allItems;
    
    // Apply filter
    if (currentFilter === 'favorite') {
        itemsToShow = itemsToShow.filter(item => item.get('isFavorite') === true);
    } else if (currentFilter !== 'all') {
        itemsToShow = itemsToShow.filter(item => item.get('type') === currentFilter);
    }
    
    // Apply search
    if (searchQuery) {
        itemsToShow = itemsToShow.filter(item => {
            const title = item.get('title') || '';
            const content = item.get('content') || '';
            const tags = item.get('tags') || [];
            const searchText = (title + ' ' + content + ' ' + tags.join(' ')).toLowerCase();
            return searchText.includes(searchQuery);
        });
    }
    
    if (itemsToShow.length === 0) {
        itemsGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    itemsGrid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    itemsToShow.forEach(item => {
        const folder = item.get('folder');
        const itemCard = createItemCard(item, folder);
        itemsGrid.appendChild(itemCard);
    });
}

function createItemCard(item, folder) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    const type = item.get('type');
    const title = item.get('title');
    const content = item.get('content');
    const isFavorite = item.get('isFavorite');
    const tags = item.get('tags') || [];
    const file = item.get('file');
    const fileName = item.get('fileName');
    const itemId = item.id;
    
    const typeLabels = {
        link: '🔗 Link',
        file: '📄 File',
        message: '💬 Message'
    };
    
    let contentDisplay = '';
    if (type === 'link') {
        contentDisplay = `<a href="${escapeHtml(content)}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none; word-break: break-all;">${escapeHtml(content)}</a>`;
    } else if (type === 'file' && file) {
        contentDisplay = `<a href="${file.url()}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color);">📎 ${escapeHtml(fileName || 'Download File')}</a>`;
    } else {
        contentDisplay = escapeHtml(content);
    }
    
    const tagsHtml = tags.length > 0 ? 
        `<div class="item-tags">${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>` : '';
    
    const favoriteClass = isFavorite ? 'active' : '';
    const favoriteTitle = isFavorite ? 'Remove from favorites' : 'Add to favorites';
    
    card.innerHTML = `
        <div class="item-header">
            <span class="item-type ${type}">${typeLabels[type] || type}</span>
            <button class="favorite-btn ${favoriteClass}" onclick="toggleFavorite('${itemId}')" title="${favoriteTitle}">
                ⭐
            </button>
        </div>
        <div class="item-title">${escapeHtml(title)}</div>
        <div class="item-content">${contentDisplay}</div>
        ${tagsHtml}
        <div class="item-footer">
            <span class="item-folder">${folder ? `📁 ${escapeHtml(folder.get('name'))}` : 'No folder'}</span>
            <div class="item-actions">
                <button class="btn-icon-small" onclick="editItem('${itemId}')" title="Edit">✏️</button>
                <button class="delete-btn" onclick="deleteItem('${itemId}')">Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

async function toggleFavorite(itemId) {
    if (!currentUser) return;
    
    try {
        const Item = Parse.Object.extend('Item');
        const query = new Parse.Query(Item);
        query.equalTo('user', currentUser);
        const item = await query.get(itemId);
        
        const currentFavorite = item.get('isFavorite') || false;
        item.set('isFavorite', !currentFavorite);
        await item.save();
        
        await loadItems();
        showNotification(currentFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (error) {
        showNotification('Failed to update favorite status', 'error');
    }
}

async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    if (!currentUser) return;
    
    try {
        const Item = Parse.Object.extend('Item');
        const query = new Parse.Query(Item);
        query.equalTo('user', currentUser);
        const item = await query.get(itemId);
        
        // Delete associated file if exists
        const file = item.get('file');
        if (file) {
            await file.destroy();
        }
        
        await item.destroy();
        await loadItems();
        showNotification('Item deleted successfully!', 'success');
    } catch (error) {
        showNotification('Failed to delete item: ' + error.message, 'error');
    }
}

async function loadFolders() {
    if (!currentUser) return;
    
    try {
        const Folder = Parse.Object.extend('Folder');
        const query = new Parse.Query(Folder);
        query.equalTo('user', currentUser);
        query.ascending('name');
        
        allFolders = await query.find();
        loadFoldersIntoSelect();
    } catch (error) {
        console.error('Error loading folders:', error);
    }
}

function loadFoldersIntoSelect() {
    const folderSelect = document.getElementById('itemFolder');
    if (!folderSelect) return;
    
    folderSelect.innerHTML = '<option value="">None</option>';
    
    allFolders.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder.id;
        option.textContent = folder.get('name');
        folderSelect.appendChild(option);
    });
}

function editItem(itemId) {
    // Find item in allItems
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Populate form with item data
    document.getElementById('itemType').value = item.get('type');
    document.getElementById('itemTitle').value = item.get('title');
    document.getElementById('itemTags').value = (item.get('tags') || []).join(', ');
    document.getElementById('itemFavorite').checked = item.get('isFavorite') || false;
    
    const type = item.get('type');
    if (type === 'link') {
        document.getElementById('itemUrl').value = item.get('content');
    } else if (type === 'file') {
        document.getElementById('itemFile').value = item.get('content');
    } else if (type === 'message') {
        document.getElementById('itemMessage').value = item.get('content');
    }
    
    const folder = item.get('folder');
    if (folder) {
        document.getElementById('itemFolder').value = folder.id;
    }
    
    // Trigger type change to show correct fields
    document.getElementById('itemType').dispatchEvent(new Event('change'));
    
    openAddModal();
    
    // Change submit button to update
    const submitBtn = document.querySelector('#addItemForm button[type="submit"]');
    submitBtn.textContent = 'Update Item';
    submitBtn.onclick = async function(e) {
        e.preventDefault();
        await updateItem(itemId);
    };
}

async function updateItem(itemId) {
    if (!currentUser) return;
    
    const type = document.getElementById('itemType').value;
    const title = document.getElementById('itemTitle').value.trim();
    const folderId = document.getElementById('itemFolder').value;
    const tags = document.getElementById('itemTags').value.trim();
    const isFavorite = document.getElementById('itemFavorite').checked;
    
    if (!title) {
        showNotification('Please enter a title', 'error');
        return;
    }
    
    let content = '';
    if (type === 'link') {
        content = document.getElementById('itemUrl').value.trim();
    } else if (type === 'file') {
        content = document.getElementById('itemFile').value.trim();
    } else if (type === 'message') {
        content = document.getElementById('itemMessage').value.trim();
    }
    
    try {
        const Item = Parse.Object.extend('Item');
        const query = new Parse.Query(Item);
        query.equalTo('user', currentUser);
        const item = await query.get(itemId);
        
        item.set('type', type);
        item.set('title', title);
        item.set('content', content);
        item.set('isFavorite', isFavorite);
        item.set('tags', tags ? tags.split(',').map(t => t.trim()) : []);
        
        if (folderId) {
            const folderPointer = Parse.Object.createWithoutData('Folder', folderId);
            item.set('folder', folderPointer);
        } else {
            item.unset('folder');
        }
        
        await item.save();
        
        closeAddModal();
        await loadItems();
        showNotification('Item updated successfully!', 'success');
    } catch (error) {
        showNotification('Failed to update item: ' + error.message, 'error');
    }
}

// Settings Page Functions
async function initializeSettings() {
    initializeNavbar();
    loadUserSettings();
    await updateStatistics();
}

function loadUserSettings() {
    if (!currentUser) return;
    
    const usernameInput = document.getElementById('settingsUsername');
    const emailInput = document.getElementById('settingsEmail');
    const createdInput = document.getElementById('settingsCreated');
    
    if (usernameInput) usernameInput.value = currentUser.get('username');
    if (emailInput) emailInput.value = currentUser.get('email');
    if (createdInput) {
        const date = currentUser.get('createdAt');
        createdInput.value = new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
    }
}

async function updateStatistics() {
    if (!currentUser) return;
    
    try {
        const Item = Parse.Object.extend('Item');
        const query = new Parse.Query(Item);
        query.equalTo('user', currentUser);
        
        const items = await query.find();
        const folders = allFolders;
        
        const totalItems = document.getElementById('totalItems');
        const totalFolders = document.getElementById('totalFolders');
        const totalLinks = document.getElementById('totalLinks');
        const totalFiles = document.getElementById('totalFiles');
        const totalFavorites = document.getElementById('totalFavorites');
        
        if (totalItems) totalItems.textContent = items.length;
        if (totalFolders) totalFolders.textContent = folders.length;
        if (totalLinks) totalLinks.textContent = items.filter(i => i.get('type') === 'link').length;
        if (totalFiles) totalFiles.textContent = items.filter(i => i.get('type') === 'file').length;
        if (totalFavorites) totalFavorites.textContent = items.filter(i => i.get('isFavorite') === true).length;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

function deleteAccount() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function confirmDeleteAccount() {
    if (!currentUser) return;
    
    if (!confirm('Are you absolutely sure? This will permanently delete your account and all data. This action cannot be undone.')) {
        return;
    }
    
    try {
        // Delete all user's items
        const Item = Parse.Object.extend('Item');
        const itemQuery = new Parse.Query(Item);
        itemQuery.equalTo('user', currentUser);
        const items = await itemQuery.find();
        
        await Parse.Object.destroyAll(items);
        
        // Delete all user's folders
        const Folder = Parse.Object.extend('Folder');
        const folderQuery = new Parse.Query(Folder);
        folderQuery.equalTo('user', currentUser);
        const folders = await folderQuery.find();
        
        await Parse.Object.destroyAll(folders);
        
        // Delete user account
        await currentUser.destroy();
        
        showNotification('Your account has been deleted.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        showNotification('Failed to delete account: ' + error.message, 'error');
    }
}

// Contact Page Functions
function initializeContact() {
    initializeNavbar();
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            try {
                const Contact = Parse.Object.extend('Contact');
                const contact = new Contact();
                contact.set('name', name);
                contact.set('email', email);
                contact.set('subject', subject);
                contact.set('message', message);
                if (currentUser) {
                    contact.set('user', currentUser);
                }
                
                await contact.save();
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        });
    }
}

// Navbar Functions
function initializeNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Theme Functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('quickstore_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('quickstore_theme', newTheme);
    showNotification(`Switched to ${newTheme} theme`, 'success');
}

// Utility Functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
