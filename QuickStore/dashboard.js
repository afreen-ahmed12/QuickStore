// Dashboard functionality using Parse/Back4App

let currentCategory = 'all';
let items = [];

// Parse Item class name
const ITEM_CLASS_NAME = 'QuickStoreItem';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Parse to be available
    if (typeof Parse === 'undefined') {
        showDashboardError('Parse SDK not loaded. Please check your internet connection.');
        return;
    }
    
    // Check if Parse is configured by checking config
    try {
        if (typeof PARSE_CONFIG !== 'undefined' && 
            (PARSE_CONFIG.applicationId === 'YOUR_APPLICATION_ID' || 
             PARSE_CONFIG.javascriptKey === 'YOUR_JAVASCRIPT_KEY')) {
            showDashboardError('Please configure your Back4App credentials in config.js');
            return;
        }
    } catch (error) {
        // Continue anyway, let Parse handle errors
    }
    
    // Check authentication
    const currentUser = Parse.User.current();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    loadItems();
    setupEventListeners();
});

// Show error message in dashboard
function showDashboardError(message) {
    const container = document.getElementById('itemsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; background: #fee2e2; color: #991b1b; padding: 24px; border-radius: 12px; text-align: center;">
                <h3 style="margin-bottom: 12px;">⚠️ Configuration Error</h3>
                <p style="margin-bottom: 16px;">${escapeHtml(message)}</p>
                <p style="font-size: 0.9rem;">Please open config.js and add your Back4App credentials.</p>
            </div>
        `;
    }
    
    if (emptyState) {
        emptyState.classList.remove('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            updateCategoryDisplay();
            filterItems();
        });
    });
    
    // Add item button
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', openAddModal);
    }
    
    // Modal close buttons
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const itemModal = document.getElementById('itemModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModalFunc);
    }
    
    if (itemModal) {
        itemModal.addEventListener('click', function(e) {
            if (e.target === itemModal) {
                closeModalFunc();
            }
        });
    }
    
    // Item form submission
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        itemForm.addEventListener('submit', handleItemSubmit);
    }
}

// Load items from Parse
async function loadItems() {
    try {
        const currentUser = Parse.User.current();
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        const Item = Parse.Object.extend(ITEM_CLASS_NAME);
        const query = new Parse.Query(Item);
        query.equalTo('user', currentUser);
        query.descending('createdAt');
        
        const results = await query.find();
        items = results.map(parseObjectToItem);
        filterItems();
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Error loading items. Please refresh the page.');
    }
}

// Convert Parse Object to item object
function parseObjectToItem(parseObject) {
    const file = parseObject.get('file');
    let fileData = null;
    if (file && file instanceof Parse.File) {
        fileData = {
            url: file.url(),
            name: file.name(),
            size: file.metadata ? file.metadata.size : 0,
            type: file.metadata ? file.metadata.type : ''
        };
    }
    
    return {
        id: parseObject.id,
        category: parseObject.get('category'),
        title: parseObject.get('title'),
        url: parseObject.get('url') || '',
        description: parseObject.get('description') || '',
        file: fileData,
        fileName: fileData ? fileData.name : null,
        fileSize: fileData ? fileData.size : null,
        fileType: fileData ? fileData.type : null,
        createdAt: parseObject.createdAt.toISOString(),
        updatedAt: parseObject.updatedAt ? parseObject.updatedAt.toISOString() : null
    };
}

// Filter items by category
function filterItems() {
    const filteredItems = currentCategory === 'all' 
        ? items 
        : items.filter(item => item.category === currentCategory);
    
    renderItems(filteredItems);
}

// Render items to DOM
function renderItems(itemsToRender) {
    const container = document.getElementById('itemsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (itemsToRender.length === 0) {
        container.innerHTML = '';
        emptyState.classList.add('active');
    } else {
        emptyState.classList.remove('active');
        container.innerHTML = itemsToRender.map(item => createItemCard(item)).join('');
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                deleteItem(itemId);
            });
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                editItem(itemId);
            });
        });
        
        // Add event listeners to download buttons
        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                downloadFile(itemId);
            });
        });
    }
}

// Create item card HTML
function createItemCard(item) {
    const date = new Date(item.createdAt).toLocaleDateString();
    const categoryEmojis = {
        books: '📚',
        tedx: '🎤',
        channels: '📺',
        links: '🔗',
        repositories: '💻',
        messages: '💬',
        files: '📁'
    };
    
    const categoryDisplay = {
        books: 'Books',
        tedx: 'TEDx',
        channels: 'Channels',
        links: 'Links',
        repositories: 'Repositories',
        messages: 'Messages',
        files: 'Files'
    };
    
    let fileSection = '';
    if (item.file && item.fileName) {
        fileSection = `
            <div class="item-file">
                <div class="item-file-icon">📎</div>
                <div class="item-file-info">
                    <div class="item-file-name">${escapeHtml(item.fileName)}</div>
                    <div class="item-file-size">${formatFileSize(item.fileSize)}</div>
                </div>
                <button class="btn-download" data-id="${item.id}">Download</button>
            </div>
        `;
    }
    
    return `
        <div class="item-card">
            <div class="item-header">
                <div>
                    <span class="item-category">${categoryEmojis[item.category]} ${categoryDisplay[item.category]}</span>
                    <h3 class="item-title">${escapeHtml(item.title)}</h3>
                </div>
            </div>
            ${item.url ? `<a href="${item.url}" target="_blank" class="item-url">${escapeHtml(item.url)}</a>` : ''}
            ${item.description ? `<p class="item-description">${escapeHtml(item.description)}</p>` : ''}
            ${fileSection}
            <div class="item-footer">
                <span class="item-date">${date}</span>
                <div class="item-actions">
                    <button class="btn-edit" data-id="${item.id}">Edit</button>
                    <button class="btn-danger btn-delete" data-id="${item.id}">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Update category display
function updateCategoryDisplay() {
    const categoryDisplay = {
        all: 'All Items',
        books: '📚 Books',
        tedx: '🎤 TEDx',
        channels: '📺 Channels',
        links: '🔗 Links',
        repositories: '💻 Repositories',
        messages: '💬 Messages',
        files: '📁 Files'
    };
    
    document.getElementById('currentCategory').textContent = categoryDisplay[currentCategory] || 'All Items';
}

// Open add modal
function openAddModal() {
    const modal = document.getElementById('itemModal');
    const form = document.getElementById('itemForm');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Add New Item';
    form.reset();
    document.getElementById('itemId').value = '';
    modal.classList.add('active');
}

// Close modal
function closeModalFunc() {
    const modal = document.getElementById('itemModal');
    modal.classList.remove('active');
    document.getElementById('itemForm').reset();
}

// Handle item form submission
async function handleItemSubmit(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const category = document.getElementById('itemCategory').value;
    const title = document.getElementById('itemTitle').value;
    const url = document.getElementById('itemUrl').value;
    const description = document.getElementById('itemDescription').value;
    const fileInput = document.getElementById('itemFile');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button during request
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        const currentUser = Parse.User.current();
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        let parseFile = null;
        
        // Handle file upload if a file is selected
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const parseFileName = `${Date.now()}_${file.name}`;
            parseFile = new Parse.File(parseFileName, file);
            await parseFile.save();
        }
        
        if (itemId) {
            // Update existing item
            await updateItem(itemId, {
                category,
                title,
                url,
                description,
                file: parseFile
            });
        } else {
            // Create new item
            await createItem({
                category,
                title,
                url,
                description,
                file: parseFile
            });
        }
        
        closeModalFunc();
        await loadItems();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Error saving item: ' + (error.message || 'Please try again.'));
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Create new item in Parse
async function createItem(itemData) {
    const currentUser = Parse.User.current();
    const Item = Parse.Object.extend(ITEM_CLASS_NAME);
    const item = new Item();
    
    item.set('user', currentUser);
    item.set('category', itemData.category);
    item.set('title', itemData.title);
    item.set('url', itemData.url || '');
    item.set('description', itemData.description || '');
    
    if (itemData.file) {
        item.set('file', itemData.file);
    }
    
    await item.save();
    return item;
}

// Update existing item in Parse
async function updateItem(itemId, itemData) {
    const Item = Parse.Object.extend(ITEM_CLASS_NAME);
    const query = new Parse.Query(Item);
    const item = await query.get(itemId);
    
    // Verify ownership
    const currentUser = Parse.User.current();
    if (item.get('user').id !== currentUser.id) {
        throw new Error('Unauthorized: You can only edit your own items.');
    }
    
    item.set('category', itemData.category);
    item.set('title', itemData.title);
    item.set('url', itemData.url || '');
    item.set('description', itemData.description || '');
    
    // Only update file if a new one is provided
    if (itemData.file) {
        // Delete old file if it exists
        const oldFile = item.get('file');
        if (oldFile) {
            try {
                await oldFile.destroy();
            } catch (error) {
                console.warn('Could not delete old file:', error);
            }
        }
        item.set('file', itemData.file);
    }
    
    await item.save();
    return item;
}

// Delete item from Parse
async function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const Item = Parse.Object.extend(ITEM_CLASS_NAME);
        const query = new Parse.Query(Item);
        const item = await query.get(itemId);
        
        // Verify ownership
        const currentUser = Parse.User.current();
        if (item.get('user').id !== currentUser.id) {
            throw new Error('Unauthorized: You can only delete your own items.');
        }
        
        // Delete associated file if it exists
        const file = item.get('file');
        if (file) {
            try {
                await file.destroy();
            } catch (error) {
                console.warn('Could not delete file:', error);
            }
        }
        
        // Delete the item
        await item.destroy();
        
        // Reload items
        await loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item: ' + (error.message || 'Please try again.'));
    }
}

// Edit item
function editItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        const modal = document.getElementById('itemModal');
        const form = document.getElementById('itemForm');
        const modalTitle = document.getElementById('modalTitle');
        
        modalTitle.textContent = 'Edit Item';
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemUrl').value = item.url || '';
        document.getElementById('itemDescription').value = item.description || '';
        
        modal.classList.add('active');
    }
}

// Download file
function downloadFile(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item && item.file && item.file.url) {
        // Open file URL in new tab for download
        window.open(item.file.url, '_blank');
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
