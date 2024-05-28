import { useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { UserInfo } from '../types/UserInfo'

// we use useMutation for post and put request
export const useSigninMutation = () =>
  useMutation({
    // async funtion that accept email and password
    mutationFn: async ({
      email,
      password,
    }: {
        // type of email and password
      email: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  })

  export const useSignupMutation = () =>
    useMutation({
      mutationFn: async ({
        name,
        email,
        password,
      }: {
        name: string
        email: string
        password: string
      }) =>
        (
          await apiClient.post<UserInfo>(`api/users/signup`, {
            name,
            email,
            password,
          })
        ).data,
    })
  