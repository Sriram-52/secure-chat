/**
 * Generated by orval v6.14.3 🍺
 * Do not edit manually.
 * Secure Chat API
 * The Secure Chat API description
 * OpenAPI spec version: 1.0
 */
import { useQuery, useMutation } from "react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from "react-query";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  CreateChannelDto,
} from "./models";
import { baseInstance } from "../../instances/baseInstance";
import type { ErrorType } from "../../instances/baseInstance";

export const userControllerCreate = (createUserDto: CreateUserDto) => {
  return baseInstance<User>({
    url: `/users/create`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: createUserDto,
  });
};

export const getUserControllerCreateMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerCreate>>,
    TError,
    { data: CreateUserDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof userControllerCreate>>,
  TError,
  { data: CreateUserDto },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userControllerCreate>>,
    { data: CreateUserDto }
  > = (props) => {
    const { data } = props ?? {};

    return userControllerCreate(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UserControllerCreateMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerCreate>>
>;
export type UserControllerCreateMutationBody = CreateUserDto;
export type UserControllerCreateMutationError = ErrorType<unknown>;

export const useUserControllerCreate = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerCreate>>,
    TError,
    { data: CreateUserDto },
    TContext
  >;
}) => {
  const mutationOptions = getUserControllerCreateMutationOptions(options);

  return useMutation(mutationOptions);
};
export const userControllerUpdate = (
  id: string,
  updateUserDto: UpdateUserDto
) => {
  return baseInstance<User>({
    url: `/users/${id}/update`,
    method: "put",
    headers: { "Content-Type": "application/json" },
    data: updateUserDto,
  });
};

export const getUserControllerUpdateMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerUpdate>>,
    TError,
    { id: string; data: UpdateUserDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof userControllerUpdate>>,
  TError,
  { id: string; data: UpdateUserDto },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userControllerUpdate>>,
    { id: string; data: UpdateUserDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return userControllerUpdate(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UserControllerUpdateMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerUpdate>>
>;
export type UserControllerUpdateMutationBody = UpdateUserDto;
export type UserControllerUpdateMutationError = ErrorType<unknown>;

export const useUserControllerUpdate = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerUpdate>>,
    TError,
    { id: string; data: UpdateUserDto },
    TContext
  >;
}) => {
  const mutationOptions = getUserControllerUpdateMutationOptions(options);

  return useMutation(mutationOptions);
};
export const userControllerGetToken = (id: string, signal?: AbortSignal) => {
  return baseInstance<string>({
    url: `/users/${id}/token`,
    method: "get",
    signal,
  });
};

export const getUserControllerGetTokenQueryKey = (id: string) =>
  [`/users/${id}/token`] as const;

export const getUserControllerGetTokenQueryOptions = <
  TData = Awaited<ReturnType<typeof userControllerGetToken>>,
  TError = ErrorType<unknown>
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof userControllerGetToken>>,
      TError,
      TData
    >;
  }
): UseQueryOptions<
  Awaited<ReturnType<typeof userControllerGetToken>>,
  TError,
  TData
> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getUserControllerGetTokenQueryKey(id);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof userControllerGetToken>>
  > = ({ signal }) => userControllerGetToken(id, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type UserControllerGetTokenQueryResult = NonNullable<
  Awaited<ReturnType<typeof userControllerGetToken>>
>;
export type UserControllerGetTokenQueryError = ErrorType<unknown>;

export const useUserControllerGetToken = <
  TData = Awaited<ReturnType<typeof userControllerGetToken>>,
  TError = ErrorType<unknown>
>(
  id: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof userControllerGetToken>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getUserControllerGetTokenQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const userControllerCreateChannel = (
  id: string,
  createChannelDto: CreateChannelDto
) => {
  return baseInstance<string>({
    url: `/users/${id}/create-channel`,
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: createChannelDto,
  });
};

export const getUserControllerCreateChannelMutationOptions = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerCreateChannel>>,
    TError,
    { id: string; data: CreateChannelDto },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof userControllerCreateChannel>>,
  TError,
  { id: string; data: CreateChannelDto },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof userControllerCreateChannel>>,
    { id: string; data: CreateChannelDto }
  > = (props) => {
    const { id, data } = props ?? {};

    return userControllerCreateChannel(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type UserControllerCreateChannelMutationResult = NonNullable<
  Awaited<ReturnType<typeof userControllerCreateChannel>>
>;
export type UserControllerCreateChannelMutationBody = CreateChannelDto;
export type UserControllerCreateChannelMutationError = ErrorType<unknown>;

export const useUserControllerCreateChannel = <
  TError = ErrorType<unknown>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof userControllerCreateChannel>>,
    TError,
    { id: string; data: CreateChannelDto },
    TContext
  >;
}) => {
  const mutationOptions =
    getUserControllerCreateChannelMutationOptions(options);

  return useMutation(mutationOptions);
};
