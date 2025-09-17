import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Agreement_Key {
  id: UUIDString;
  __typename?: 'Agreement_Key';
}

export interface Application_Key {
  id: UUIDString;
  __typename?: 'Application_Key';
}

export interface CreateApplicationData {
  application_insert: Application_Key;
}

export interface CreateApplicationVariables {
  listingId: UUIDString;
  userId: UUIDString;
  personalStatement: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface GetUserPropertiesData {
  properties: ({
    id: UUIDString;
    title: string;
    address: string;
    rentAmount: number;
  } & Property_Key)[];
}

export interface GetUserPropertiesVariables {
  ownerId: UUIDString;
}

export interface ListPropertiesData {
  properties: ({
    id: UUIDString;
    title: string;
    address: string;
    rentAmount: number;
  } & Property_Key)[];
}

export interface Listing_Key {
  id: UUIDString;
  __typename?: 'Listing_Key';
}

export interface Payment_Key {
  id: UUIDString;
  __typename?: 'Payment_Key';
}

export interface Property_Key {
  id: UUIDString;
  __typename?: 'Property_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListPropertiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPropertiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPropertiesData, undefined>;
  operationName: string;
}
export const listPropertiesRef: ListPropertiesRef;

export function listProperties(): QueryPromise<ListPropertiesData, undefined>;
export function listProperties(dc: DataConnect): QueryPromise<ListPropertiesData, undefined>;

interface CreateApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
  operationName: string;
}
export const createApplicationRef: CreateApplicationRef;

export function createApplication(vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;
export function createApplication(dc: DataConnect, vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;

interface GetUserPropertiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPropertiesVariables): QueryRef<GetUserPropertiesData, GetUserPropertiesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPropertiesVariables): QueryRef<GetUserPropertiesData, GetUserPropertiesVariables>;
  operationName: string;
}
export const getUserPropertiesRef: GetUserPropertiesRef;

export function getUserProperties(vars: GetUserPropertiesVariables): QueryPromise<GetUserPropertiesData, GetUserPropertiesVariables>;
export function getUserProperties(dc: DataConnect, vars: GetUserPropertiesVariables): QueryPromise<GetUserPropertiesData, GetUserPropertiesVariables>;

