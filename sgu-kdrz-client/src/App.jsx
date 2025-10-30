import { useState, useEffect } from 'react'
import './App.css'
import PersonController from './modules/person/person.controller'

function App() {
  const [persons, setPersons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  })

  // Cargar personas al inicio
  useEffect(() => {
    fetchPersons()
  }, [])

  const fetchPersons = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await PersonController.getAll()
      if (result.success) {
        setPersons(result.data)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = editingPerson 
        ? await PersonController.update(editingPerson.id, formData)
        : await PersonController.create(formData)
      
      if (result.success) {
        await fetchPersons()
        resetForm()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error al guardar la persona')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (person) => {
    setEditingPerson(person)
    setFormData({
      fullName: person.fullName,
      email: person.email,
      phoneNumber: person.phoneNumber
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta persona?')) return

    setLoading(true)
    setError(null)
    try {
      const result = await PersonController.delete(id)
      
      if (result.success) {
        await fetchPersons()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error al eliminar la persona')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phoneNumber: '' })
    setEditingPerson(null)
    setIsFormOpen(false)
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Gestión de Usuarios</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsFormOpen(true)}
            disabled={loading}
          >
            + Nuevo Usuario
          </button>
        </header>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {isFormOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingPerson ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button className="btn-close" onClick={resetForm}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Nombre Completo</label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Número de Teléfono</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={loading}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="table-container">
          {loading && !isFormOpen ? (
            <div className="loading">Cargando...</div>
          ) : persons.length === 0 ? (
            <div className="empty-state">
              <p>No hay usuarios registrados</p>
              <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
                Agregar el primero
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {persons.map((person) => (
                  <tr key={person.id}>
                    <td>{person.fullName}</td>
                    <td>{person.email}</td>
                    <td>{person.phoneNumber}</td>
                    <td className="actions">
                      <button 
                        className="btn-icon btn-edit" 
                        onClick={() => handleEdit(person)}
                        disabled={loading}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleDelete(person.id)}
                        disabled={loading}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
