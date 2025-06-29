import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseTest() {
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('test_table').select('*').limit(1)
        if (error) {
          setStatus('Errore: ' + error.message)
        } else {
          setStatus('Connessione riuscita!')
        }
      } catch (err) {
        setStatus('Errore di connessione')
      }
    }
    testConnection()
  }, [])

  return (
    <div style={{padding:20}}>
      <h2>Test Connessione Supabase</h2>
      <p>{status}</p>
    </div>
  )
}