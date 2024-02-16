import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { IEntepriseUsersResponse } from "../../pages/interfaces/IEntepriseUsersResponse";
import { API_URL } from "../../utils/constants";
import { ICreateEnterpriseRequest } from "../../pages/interfaces/ICreateEnterpriseRequest";

interface IResponseError {
  code: number;
  message: string;
  details: any;
}

export function useEnterprise(
  taxId: string
): UseQueryResult<any, IResponseError> {
  return useQuery<any, IResponseError, any>({
    queryKey: ["enterpriseUsers", taxId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/enterprise/users?taxId=${taxId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch enterprise users");
      }
      return response.json();
    },
    select: (data) => data.users as IEntepriseUsersResponse[],
    // TODO: for now
    refetchInterval: 50000,
  });
}

export function useCreateEnterprise(): UseMutationResult<
  any,
  IResponseError,
  ICreateEnterpriseRequest,
  any
> {
  return useMutation<any, any, ICreateEnterpriseRequest, any>({
    mutationFn: async (variables) =>
      await fetch(`${API_URL}/enterprise/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      }).then((res) => res.json()),
  });
}
