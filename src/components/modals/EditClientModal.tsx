import React, { useState, useEffect } from 'react'
import { X, User, Building, Mail, Phone, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { clientService } from '@/lib/database'
import type { Client } from '@/lib/supabase'

interface EditClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (client: Client) => void
  client: Client | null
}

export function EditClientModal({ isOpen, onClose, onSuccess, client }: EditClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    sector: '',
    status: 'lead' as 'lead' | 'prospect' | 'active' | 'loyal',
    communication_style: '',
    notes: '',
    active_channels: [] as string[],
    pain_points: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Popola il form quando il client cambia
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        company: client.company || '',
        email: client.email || '',
        phone: client.phone || '',
        sector: client.sector || '',
        status: (client.status || 'lead') as 'lead' | 'prospect' | 'active' | 'loyal',
        communication_style: client.communication_style || '',
        notes: client.notes || '',
        active_channels: client.active_channels || [],
        pain_points: client.pain_points || []
      })
    }
  }, [client])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) return
    
    setLoading(true)
    setError('')

    try {
      const updatedClient = await clientService.update(client.id, formData)
      onSuccess(updatedClient)
      onClose()
    } catch (err) {
      setError('Errore durante l\'aggiornamento del cliente')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addPainPoint = () => {
    const input = document.getElementById('pain-point-input') as HTMLInputElement
    if (input && input.value.trim()) {
      setFormData(prev => ({
        ...prev,
        pain_points: [...prev.pain_points, input.value.trim()]
      }))
      input.value = ''
    }
  }

  const removePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pain_points: prev.pain_points.filter((_, i) => i !== index)
    }))
  }

  const addActiveChannel = () => {
    const input = document.getElementById('channel-input') as HTMLInputElement
    if (input && input.value.trim()) {
      setFormData(prev => ({
        ...prev,
        active_channels: [...prev.active_channels, input.value.trim()]
      }))
      input.value = ''
    }
  }

  const removeActiveChannel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      active_channels: prev.active_channels.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Modifica Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Nome *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome del cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline h-4 w-4 mr-1" />
                Azienda
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome dell'azienda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@esempio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Telefono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Settore
              </label>
              <select
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleziona settore</option>
                <option value="technology">Tecnologia</option>
                <option value="healthcare">Sanità</option>
                <option value="finance">Finanza</option>
                <option value="education">Educazione</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manifatturiero</option>
                <option value="other">Altro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="active">Attivo</option>
                <option value="inactive">Inattivo</option>
                <option value="potential">Potenziale</option>
              </select>
            </div>
          </div>

          {/* Communication Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stile di Comunicazione
            </label>
            <textarea
              value={formData.communication_style}
              onChange={(e) => handleInputChange('communication_style', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrivi lo stile di comunicazione preferito del cliente..."
            />
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pain Points
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="pain-point-input"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Aggiungi un pain point..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
              />
              <Button type="button" onClick={addPainPoint} className="px-4">
                Aggiungi
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.pain_points.map((point, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                >
                  {point}
                  <button
                    type="button"
                    onClick={() => removePainPoint(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Active Channels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canali Attivi
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="channel-input"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Aggiungi un canale (es. WhatsApp, Email, Telefono)..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActiveChannel())}
              />
              <Button type="button" onClick={addActiveChannel} className="px-4">
                Aggiungi
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.active_channels.map((channel, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {channel}
                  <button
                    type="button"
                    onClick={() => removeActiveChannel(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Note aggiuntive sul cliente..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Aggiornamento...' : 'Aggiorna Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}