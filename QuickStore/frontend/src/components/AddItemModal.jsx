import { useState } from 'react'
import { itemsService } from '../services/parseService'
import { X, Link2, FileText, MessageSquare, File, Upload } from 'lucide-react'

const AddItemModal = ({ isOpen, onClose, onSuccess, folders, defaultType = 'link' }) => {
  const [type, setType] = useState(defaultType)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    url: '',
    section: 'general',
    folderId: '',
    tags: ''
  })
  const [file, setFile] = useState(null)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (type === 'file' && file) {
        const tags = formData.tags 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : []
        
        await itemsService.uploadFile(file, {
          title: formData.title || file.name,
          section: formData.section,
          folderId: formData.folderId || null,
          tags
        })
      } else {
        const payload = {
          type,
          title: formData.title,
          section: formData.section,
          folderId: formData.folderId || null
        }

        if (type === 'link') {
          payload.url = formData.url
          payload.content = formData.content
        } else {
          payload.content = formData.content
        }

        if (formData.tags) {
          payload.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }

        await itemsService.createItem(payload)
      }

      setFormData({ title: '', content: '', url: '', section: 'general', folderId: '', tags: '' })
      setFile(null)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Item</h2>
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

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Item Type
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'link', icon: Link2, label: 'Link' },
                { id: 'text', icon: FileText, label: 'Text' },
                { id: 'message', icon: MessageSquare, label: 'Message' },
                { id: 'file', icon: File, label: 'File' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setType(id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    type === id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${type === id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
                  <span className={`text-sm ${type === id ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
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
              placeholder="Enter title"
            />
          </div>

          {/* URL (for links) */}
          {type === 'link' && (
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
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* Content */}
          {(type === 'text' || type === 'message' || type === 'link') && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                {type === 'message' ? 'Message' : 'Content'}
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder={type === 'message' ? 'Enter your message...' : 'Enter content...'}
              />
            </div>
          )}

          {/* File Upload */}
          {type === 'file' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                File
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Max 10MB</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {file.name}
                </p>
              )}
            </div>
          )}

          {/* Section */}
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

          {/* Folder */}
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

          {/* Tags */}
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
              disabled={loading || (type === 'file' && !file) || (type === 'link' && !formData.url)}
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddItemModal

