'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function UploadImage({ tradeId }: { tradeId: number }) {
  const supabase = createClient()
  const router = useRouter()

  const setImgUrl = async (imgUrl: String) => {
    const { error } = await supabase
      .from('consolidated_trades')
      .update({
        image_url: imgUrl,
        // user_id: user?.id,
      })
      .eq('id', tradeId)

    if (error) throw error
  }

  const handleFileUpload = async (e: any) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    try {
      const fileExt = uploadedFile.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `images/${fileName}`

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, uploadedFile)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage.from('images').getPublicUrl(filePath)
      setImgUrl(data.publicUrl)

      // TODO: add toastify notification
      console.log('File uploaded:', data.publicUrl)
      e.target.value = null
      router.refresh()
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="file-input w-full mt-8"
        onChange={handleFileUpload}
      />
    </>
  )
}
