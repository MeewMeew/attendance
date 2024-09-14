import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { storage } from '@/shared/firebase'

export default class Storage {
  static async uploadFile(path: string, file: File | Blob) {
    const storageRef = ref(storage, path)
    await uploadBytesResumable(storageRef, file)
    return Storage.getFileUrl(path)
  }

  static async deleteFile(path: string) {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  }

  static async getFileUrl(path: string) {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  }
}
