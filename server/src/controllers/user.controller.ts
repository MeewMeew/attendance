
import { auth, db } from '../shared/firebase'
import { defaultLogin } from '../shared/constants'

import { logger } from '../utils/logger'
import { nanoid } from 'nanoid'

export async function create(users: any[]) {
  try {
    logger.info('Creating users count:', users.length)
    return {
      code: 200,
      data: await Promise.allSettled(users.map(async function (user) {
        let data: Record<string, any>
        const record = await auth.createUser({ ...user, emailVerified: true, uid: nanoid() })
        await auth.setCustomUserClaims(record.uid, { admin: false })
        if (user.role === 'student') {
          data = {
            docId: record.uid,
            role: 'student',
            studentId: user.studentId,
            batchId: user.batchId,
            facultyId: user.facultyId,
            classId: user.classId
          }
        } else {
          data = {
            docId: record.uid,
            role: 'instructor',
            instructorId: user.instructorId,
            facultyId: user.facultyId
          }
        }
        data = {
          ...data,
          email: user.email,
          displayName: user.displayName,
          photoURL: '',
          phoneNumber: user.phoneNumber,
          loginInfo: defaultLogin,
          createdAt: new Date().toISOString()
        }
        await db.collection('users').doc(record.uid).set(data)
        return record.toJSON()
      }))
    }
  } catch (err) {
    logger.error(err)
    throw err
  }
}

export async function update(user: any) {
  try {
    logger.info('Updating user:', user.docId)
    await auth.updateUser(user.docId, user)
    delete user.password
    await db.collection('users').doc(user.docId).update(user)
    return {
      code: 200,
      message: 'Update user successfully'
    }
  } catch (err) {
    logger.error(err)
    throw err
  }
}

export async function remove(id: string) {
  try {
    logger.info('Deleting user:', id)
    await auth.deleteUser(id)
    await db.collection('users').doc(id).delete()
    return {
      code: 200,
      message: 'Delete user successfully'
    }
  } catch (err) {
    logger.error(err)
    throw err
  }
}