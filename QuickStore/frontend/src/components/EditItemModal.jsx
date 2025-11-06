import { useState, useEffect } from 'react'
import { itemsService } from '../services/parseService'
import { X } from 'lucide-react'

const EditItemModal = ({ isOpen, onClose, onSuccess, item, folders }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    url: '',
    section: 'general',
    folderId: '',
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sections = [
    { id: 'repos', name: 'Repos' },
    { id: 'github', name: 'GitHub' },
    { id: 'useful', name: 'Useful' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'general', name: 'General' },
    { id: 'other', name: 'Other' }
  ]

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        content: item.content || '',
        url: item.url || '',
        section: item.section || 'general',
        folderId: item.folderId || '',
        tags: item.tags?.join(', ') || ''
      })
    }
  }, [item])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        section: formData.section,
        folderId: formData.folderId || null
      }

      if (item.type === 'link') {
        payload.url = formData.url
        payload.content = formData.content
      } else {
        payload.content = formData.content
      }

      if (formData.tags) {
        payload.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      await itemsService.updateItem(item._id, payload)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update item')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          {item.type === 'link' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                URL *
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          )}

          {(item.type === 'text' || item.type === 'message' || item.type === 'link') && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {item.type === 'message' ? 'Message' : 'Content'}
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Section
            </label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="input-field"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>{section.name}</option>
              ))}
            </select>
          </div>

          {folders.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Folder (Optional)
              </label>
              <select
                name="folderId"
                value={formData.folderId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">No Folder</option>
                {folders.map(folder => (
                  <option key={folder._id} value={folder._id}>{folder.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditItemModal

