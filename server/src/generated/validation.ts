/* eslint-disable */
// tslint:disable
/**
 * Secure Chat API
 * This is a secure chat API.
You can find out more at [secure-chat-app](https://github.com/Sriram-52/secure-chat).

 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator+.
 * https://github.com/karlvr/openapi-generator-plus
 * Do not edit the class manually.
 */

import { Express } from 'express'
import { Api } from './models'

type FromJsonFunction<T> = (name: string, value: any) => T
type MapOf<T> = { [name: string]: T }

/**
 * A conditional type to convert an interface model to the equivalent JSON model.
 * We may represent dates as Date objects in our object model, but we must translate
 * them to strings for the JSON model.
 */
type ToJson<T> =
	T extends Date ? string
	: T extends object ? {
		[P in keyof T]: ToJson<T[P]>
	}
	: T extends (infer R)[] ? ToJson<R>[]
	: T

export function arrayFromJson<T>(next: FromJsonFunction<T>): FromJsonFunction<T[]> {
	return function(name: string, value: any) {
		if (typeof value !== 'object' || typeof value.length !== 'number') {
			throw `Invalid type for ${name}: expected array got ${typeof value}`
		}
	
		const result: T[] = []
		for (const el of value) {
			result.push(next(name, el))
		}
		return result
	}
}

export function arrayToJson<T>(next: FromJsonFunction<T>): FromJsonFunction<T[]> {
	return arrayFromJson(next)
}

export function mapFromJson<T>(next: FromJsonFunction<T>): FromJsonFunction<MapOf<T>> {
	return function(name: string, value: any) {
		if (typeof value !== 'object') {
			throw `Invalid type for ${name}: expected object got ${typeof value}`
		}
	
		const result: MapOf<T> = {}
		for (const key in value) {
			if (value.hasOwnProperty(key)) {
				result[key] = next(name, value[key])
			}
		}
		return result
	}
}

export function mapToJson<T>(next: FromJsonFunction<T>): FromJsonFunction<MapOf<T>> {
	return mapFromJson(next)
}

export function allowNull<T>(next: FromJsonFunction<T>): FromJsonFunction<T | null> {
	return function(name: string, value: any) {
		if (value === null) {
			return null
		}
		return next(name, value)
	}
}

export function allowUndefined<T>(next: FromJsonFunction<T>): FromJsonFunction<T | undefined> {
	return function(name: string, value: any) {
		if (value === undefined) {
			return undefined
		}
		return next(name, value)
	}
}

export function allowNullOrUndefined<T>(next: FromJsonFunction<T>): FromJsonFunction<T | null | undefined> {
	return function(name: string, value: any) {
		if (value === null) {
			return null
		}
		if (value === undefined) {
			return undefined
		}
		return next(name, value)
	}
}

export function unsupportedFromJson(name: string, value: any): unknown {
	if (value === undefined) {
		throw `Invalid type for ${name}: expected unknown got undefined`
	}
	return value
}

export function unsupportedToJson(name: string, value: unknown): any {
	return unsupportedFromJson(name, value)
}

export function parseUnsupported(name: string, value: any): unknown {
	if (value === undefined) {
		throw `Invalid value for ${name}: expected unknown got undefined`
	}
	return value
}

export function booleanFromJson(name: string, value: any): boolean {
	if (typeof value !== 'boolean') {
		throw `Invalid type for ${name}: expected boolean got ${typeof value}`
	}
	return value
}

export function booleanToJson(name: string, value: boolean): any {
	return booleanFromJson(name, value)
}

export function parseBoolean(name: string, value: any): boolean {
	if (value === 'true') {
		return true
	} else if (value === 'false') {
		return false
	} else {
		throw `Invalid value for ${name}: expected boolean got "${value}"`
	}
}

export function stringFromJson(name: string, value: any): string {
	if (typeof value !== 'string') {
		throw `Invalid type for ${name}: expected string got ${typeof value}`
	}
	return value
}

export function stringToJson(name: string, value: string): any {
	return stringFromJson(name, value)
}

export function binaryFromJson(name: string, value: any): Buffer {
	if (typeof value !== 'string') {
		throw `Invalid type for ${name}: expected string got ${typeof value}`
	}
	return new Buffer(value, 'base64')
}

export function binaryToJson(name: string, value: string | Buffer): string {
	if (typeof value === 'string') {
		return value
	} else {
		return value.toString('base64')
	}
}

export function parseString(name: string, value: any): string {
	if (value === undefined) {
		throw `Invalid value for ${name}: expected string got undefined`
	}
	if (typeof value === 'string') {
		return value
	}
	if (typeof value === 'object' && typeof value.length === 'number') {
		if (value.length > 0) {
			return value[0]
		}
	}

	throw `Invalid value for ${name}: expected string got ${typeof value}`
}

export function integerFromJson(name: string, value: any): number {
	if (typeof value !== 'number') {
		throw `Invalid type for ${name}: expected number got ${typeof value}`
	}
	if (isNaN(value)) {
		throw `Invalid NaN for ${name}`
	}
	if (Math.floor(value) !== value) {
		throw `Invalid value for ${name}: expected integer got "${value}"`
	}
	return value
}

export function integerToJson(name: string, value: number): any {
	return integerFromJson(name, value)
}

export function parseInteger(name: string, value: any): number {
	if (typeof value === 'object' && typeof value.length === 'number' && value.length > 0) {
		value = value[0]
	}
	if (typeof value === 'string') {
		if (value.indexOf('.') !== -1) {
			throw `Invalid value for ${name}: expected integer got "${value}"`
		}

		const result = parseInt(value, 10)
		if (isNaN(result)) {
			throw `Invalid value for ${name}: expected integer got "${value}"`
		}
		return result
	}
	throw `Invalid value for ${name}: expected integer got ${typeof value}`
}

export function numberFromJson(name: string, value: any): number {
	if (typeof value !== 'number') {
		throw `Invalid type for ${name}: expected number got ${typeof value}`
	}
	if (isNaN(value)) {
		throw `Invalid NaN for ${name}`
	}
	return value
}

export function numberToJson(name: string, value: number): any {
	return numberFromJson(name, value)
}

export function parseNumber(name: string, value: any): number {
	if (typeof value === 'object' && typeof value.length === 'number' && value.length > 0) {
		value = value[0]
	}
	if (typeof value === 'string') {
		const result = parseFloat(value)
		if (isNaN(result)) {
			throw `Invalid value for ${name}: expected float got "${value}"`
		}
		return result
	}
	throw `Invalid value for ${name}: expected number got ${typeof value}`
}

export function dateFromJson(name: string, value: any): string {
	if (typeof value !== 'string') {
		throw `Invalid type for ${name}: expected string got ${typeof value}`
	}
	if (!value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
		throw `Invalid value for ${name}: expected valid date string got "${value}"`
	}
	return value
}

export function parseDate(name: string, value: any): string {
	return dateFromJson(name, value)
}

export function dateToJson(name: string, value: string): string {
	return dateFromJson(name, value)
}

export function dateTimeFromJson(name: string, value: any): Date {
	if (typeof value !== 'string') {
		throw `Invalid type for ${name}: expected string got ${typeof value}`
	}
	if (!value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?(Z|(\+|-)[0-9]{2}(:?[0-9]{2})?)$/)) {
		throw `Invalid value for ${name}: expected valid datetime string got "${value}"`
	}
	return new Date(value)
}

export function parseDateTime(name: string, value: any): Date {
	return dateTimeFromJson(name, value)
}

export function dateTimeToJson(name: string, value: Date): string {
	if (typeof value !== 'object' || typeof value.toISOString !== 'function') {
		throw `Invalid type for ${name}: expected Date got ${typeof value}`
	}
	return value.toISOString()
}

export function timeFromJson(name: string, value: any): string {
	if (typeof value !== 'string') {
		throw `Invalid type for ${name}: expected string got ${typeof value}`
	}
	if (!value.match(/^[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?$/)) {
		throw `Invalid value for ${name}: expected valid time string got "${value}"`
	}
	return value
}

export function parseTime(name: string, value: any): string {
	return timeFromJson(name, value)
}

export function timeToJson(name: string, value: string): string {
	return timeFromJson(name, value)
}

/* Model conversion functions */

const ApiMessageKeys: string[] = ['id', 'sender', 'receiver', 'message']

function modelApiMessageFromJsonContent(name: string, value: any, knownKeys: Record<string, boolean> = {}): Api.Message {
	if (typeof value !== 'object' || value === undefined || value === null) {
		throw `Invalid type for ${name}: expected object got ${typeof value}`
	}

	ApiMessageKeys.forEach(k => knownKeys[k] = true)

	const result: Api.Message = {
		'id': allowUndefined(stringFromJson)(`${name}.id`, value['id']),
		'sender': stringFromJson(`${name}.sender`, value['sender']),
		'receiver': stringFromJson(`${name}.receiver`, value['receiver']),
		'message': stringFromJson(`${name}.message`, value['message']),
	}

	return result
}

function modelApiMessageToJsonContent(name: string, value: Api.Message, knownKeys: Record<string, boolean> = {}): ToJson<Api.Message> {
	if (typeof value !== 'object' || value === undefined || value === null) {
		throw `Invalid type for ${name}: expected object got ${typeof value}`
	}

	ApiMessageKeys.forEach(k => knownKeys[k] = true)
	
	const result: ToJson<Api.Message> = {
		'id': allowUndefined(stringToJson)(`${name}.id`, value['id']),
		'sender': stringToJson(`${name}.sender`, value['sender']),
		'receiver': stringToJson(`${name}.receiver`, value['receiver']),
		'message': stringToJson(`${name}.message`, value['message']),
	}

	return result
}

export function modelApiMessageFromJson(name: string, value: any): Api.Message {
	const knownKeys: Record<string, boolean> = {}
	const result: Api.Message = modelApiMessageFromJsonContent(name, value, knownKeys)

	/* Known keys */
	// TODO if we don't ignore unknown properties
	for (const key of Object.keys(value)) {
		if (!knownKeys[key]) {
			// throw `Unexpected key: ${key}`
			console.warn(`Unexpected key in Api.Message: ${key}`)
		}
	}

	return result
}

export function modelApiMessageToJson(name: string, value: Api.Message): ToJson<Api.Message> {
	const knownKeys: Record<string, boolean> = {}
	const result: ToJson<Api.Message> = modelApiMessageToJsonContent(name, value, knownKeys)

	/* Known keys */
	// TODO if we don't ignore unknown properties
	for (const key of Object.keys(value)) {
		if (!knownKeys[key]) {
			// throw `Unexpected key: ${key}`
			console.warn(`Unexpected key in Api.Message: ${key}`)
		}
	}

	return result
}

const ApiUserKeys: string[] = ['id', 'username', 'email', 'password']

function modelApiUserFromJsonContent(name: string, value: any, knownKeys: Record<string, boolean> = {}): Api.User {
	if (typeof value !== 'object' || value === undefined || value === null) {
		throw `Invalid type for ${name}: expected object got ${typeof value}`
	}

	ApiUserKeys.forEach(k => knownKeys[k] = true)

	const result: Api.User = {
		'id': allowUndefined(stringFromJson)(`${name}.id`, value['id']),
		'username': stringFromJson(`${name}.username`, value['username']),
		'email': stringFromJson(`${name}.email`, value['email']),
		'password': allowUndefined(stringFromJson)(`${name}.password`, value['password']),
	}

	return result
}

function modelApiUserToJsonContent(name: string, value: Api.User, knownKeys: Record<string, boolean> = {}): ToJson<Api.User> {
	if (typeof value !== 'object' || value === undefined || value === null) {
		throw `Invalid type for ${name}: expected object got ${typeof value}`
	}

	ApiUserKeys.forEach(k => knownKeys[k] = true)
	
	const result: ToJson<Api.User> = {
		'id': allowUndefined(stringToJson)(`${name}.id`, value['id']),
		'username': stringToJson(`${name}.username`, value['username']),
		'email': stringToJson(`${name}.email`, value['email']),
		'password': allowUndefined(stringToJson)(`${name}.password`, value['password']),
	}

	return result
}

export function modelApiUserFromJson(name: string, value: any): Api.User {
	const knownKeys: Record<string, boolean> = {}
	const result: Api.User = modelApiUserFromJsonContent(name, value, knownKeys)

	/* Known keys */
	// TODO if we don't ignore unknown properties
	for (const key of Object.keys(value)) {
		if (!knownKeys[key]) {
			// throw `Unexpected key: ${key}`
			console.warn(`Unexpected key in Api.User: ${key}`)
		}
	}

	return result
}

export function modelApiUserToJson(name: string, value: Api.User): ToJson<Api.User> {
	const knownKeys: Record<string, boolean> = {}
	const result: ToJson<Api.User> = modelApiUserToJsonContent(name, value, knownKeys)

	/* Known keys */
	// TODO if we don't ignore unknown properties
	for (const key of Object.keys(value)) {
		if (!knownKeys[key]) {
			// throw `Unexpected key: ${key}`
			console.warn(`Unexpected key in Api.User: ${key}`)
		}
	}

	return result
}