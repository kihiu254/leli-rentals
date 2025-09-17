import { CreateUserData, ListPropertiesData, CreateApplicationData, CreateApplicationVariables, GetUserPropertiesData, GetUserPropertiesVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListProperties(options?: useDataConnectQueryOptions<ListPropertiesData>): UseDataConnectQueryResult<ListPropertiesData, undefined>;
export function useListProperties(dc: DataConnect, options?: useDataConnectQueryOptions<ListPropertiesData>): UseDataConnectQueryResult<ListPropertiesData, undefined>;

export function useCreateApplication(options?: useDataConnectMutationOptions<CreateApplicationData, FirebaseError, CreateApplicationVariables>): UseDataConnectMutationResult<CreateApplicationData, CreateApplicationVariables>;
export function useCreateApplication(dc: DataConnect, options?: useDataConnectMutationOptions<CreateApplicationData, FirebaseError, CreateApplicationVariables>): UseDataConnectMutationResult<CreateApplicationData, CreateApplicationVariables>;

export function useGetUserProperties(vars: GetUserPropertiesVariables, options?: useDataConnectQueryOptions<GetUserPropertiesData>): UseDataConnectQueryResult<GetUserPropertiesData, GetUserPropertiesVariables>;
export function useGetUserProperties(dc: DataConnect, vars: GetUserPropertiesVariables, options?: useDataConnectQueryOptions<GetUserPropertiesData>): UseDataConnectQueryResult<GetUserPropertiesData, GetUserPropertiesVariables>;
