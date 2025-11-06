import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { itemsService, foldersService } from '../services/parseService'
import { Plus, Search, FolderPlus, Link2, FileText, MessageSquare, File, X, Edit2, Trash2, Folder } from 'lucide-react'
import AddItemModal from '../components/AddItemModal'
import AddFolderModal from '../components/AddFolderModal'
import EditItemModal from '../components/EditItemModal'

const Dashboard = () => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState('all')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [itemType, setItemType] = useState('link')

  const sections = [
    { id: 'all', name: 'All Items', icon: '📦' },
    { id: 'repos', name: 'Repos', icon: '💻' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'useful', name: 'Useful', icon: '⭐' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'general', name: 'General', icon: '📝' },
    { id: 'other', name: 'Other', icon: '🔗' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [itemsData, foldersData] = await Promise.all([
        itemsService.getAllItems(),
        foldersService.getAllFolders()
      ])
      setItems(itemsData)
      setFolders(foldersData)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to load data. Please check your Back4App configuration.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    
    try {
      await itemsService.deleteItem(id)
      setItems(items.filter(item => item._id !== id))
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleDeleteFolder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this folder? Items inside will not be deleted.')) return
    
    try {
      await foldersService.deleteFolder(id)
      setFolders(folders.filter(folder => folder._id !== id))
    } catch (error) {
      console.error('Error deleting folder:', error)
      alert('Failed to delete folder')
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSection = selectedSection === 'all' || item.section === selectedSection
    const matchesFolder = selectedFolder === 'all' || 
      (selectedFolder === 'none' && !item.folderId) ||
      item.folderId === selectedFolder

    return matchesSearch && matchesSection && matchesFolder
  })

  const getItemIcon = (type) => {
    switch (type) {
      case 'link': return <Link2 className="w-5 h-5" />
      case 'text': return <FileText className="w-5 h-5" />
      case 'message': return <MessageSquare className="w-5 h-5" />
      case 'file': return <File className="w-5 h-5" />
      default: return <Link2 className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your links, notes, messages, and files
          </p>
        </div>

        {/* Actions Bar */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setItemType('link')
                  setShowAddModal(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Item</span>
              </button>
              <button
                onClick={() => setShowFolderModal(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <FolderPlus className="w-5 h-5" />
                <span className="hidden sm:inline">New Folder</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Sections</h3>
              <div className="space-y-2 mb-6">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedSection === section.id
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </div>

              {folders.length > 0 && (
                <>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Folders</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedFolder('all')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedFolder === 'all'
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => setSelectedFolder('none')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedFolder === 'none'
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      No Folder
                    </button>
                    {folders.map(folder => (
                      <div key={folder._id} className="flex items-center group">
                        <button
                          onClick={() => setSelectedFolder(folder._id)}
                          className={`flex-1 text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedFolder === folder._id
                              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Folder className="w-4 h-4 inline mr-2" style={{ color: folder.color }} />
                          {folder.name}
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredItems.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  No items found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || selectedSection !== 'all' || selectedFolder !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Start by adding your first item!'}
                </p>
                {!searchQuery && selectedSection === 'all' && selectedFolder === 'all' && (
                  <button
                    onClick={() => {
                      setItemType('link')
                      setShowAddModal(true)
                    }}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Item</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => {
                  const folder = folders.find(f => f._id === item.folderId)
                  return (
                    <div key={item._id} className="card hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="text-primary-600 dark:text-primary-400">
                            {getItemIcon(item.type)}
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline text-sm mb-2 block truncate"
                        >
                          {item.url}
                        </a>
                      )}

                      {item.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {item.content}
                        </p>
                      )}

                      {item.fileName && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <File className="w-4 h-4" />
                          <span className="truncate">{item.fileName}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-400">
                            {sections.find(s => s.id === item.section)?.name || item.section}
                          </span>
                          {folder && (
                            <span
                              className="px-2 py-1 text-xs rounded-full flex items-center space-x-1"
                              style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                            >
                              <Folder className="w-3 h-3" />
                              <span>{folder.name}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
          folders={folders}
          defaultType={itemType}
        />
      )}

      {showFolderModal && (
        <AddFolderModal
          isOpen={showFolderModal}
          onClose={() => setShowFolderModal(false)}
          onSuccess={fetchData}
        />
      )}

      {editingItem && (
        <EditItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={fetchData}
          item={editingItem}
          folders={folders}
        />
      )}
    </div>
  )
}

export default Dashboard

