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
import passport from 'passport'
import * as t from './types'
import * as v from '../../validation'
import { Api } from '../../models'

export default function(app: Express, impl: t.AuthenticationApi) {
	app.post(
		'/login',
		function (req, res) {
			try {
				function __body() {
					const __contentType = req.get('Content-Type')
					const __mimeType = __contentType ? __contentType.replace(/;.*/, '') : undefined

					if (__mimeType === 'application/json') {
						return v.modelApiUserFromJson('body', req.body)
					}
					console.error(`Invalid request content type: ${__contentType}`)
					throw new Error(`Invalid request content type: ${__contentType}`)
				}

				impl.loginUser(__body()).then(function (response) {
					if (response.status === 200) {
						let body: any
						try {
							body = v.modelApiUserToJson('response', response.body)
						} catch (error) {
							console.error('Invalid response body in authentication.loginUser', error)
							res.status(500)
							res.send()
							return
						}

						res.status(200)
						res.send(body)
						return
					}
					if (response.status === 400) {
						res.status(400)
						res.send()
						return
					}
					if (response.status === 404) {
						res.status(404)
						res.send()
						return
					}

					console.log('Unsupported response in authentication.loginUser', response)
					res.status(500)
					res.send()
				}).catch(function (error) {
					console.error('Unexpected error in authentication.loginUser', error.stack || error)
					res.status(500)
					res.send()
				})
			} catch (error) {
				/* Catch validation errors */
				res.status(400)
				res.send(error)
			}
		}
	)

	app.post(
		'/logout',
		function (req, res) {
			try {
				function __body() {
					const __contentType = req.get('Content-Type')
					const __mimeType = __contentType ? __contentType.replace(/;.*/, '') : undefined

					if (__mimeType === 'application/json') {
						return v.modelApiUserFromJson('body', req.body)
					}
					console.error(`Invalid request content type: ${__contentType}`)
					throw new Error(`Invalid request content type: ${__contentType}`)
				}

				impl.logoutUser(__body()).then(function (response) {
					if (response.status === 200) {
						let body: any
						try {
							body = v.modelApiUserToJson('response', response.body)
						} catch (error) {
							console.error('Invalid response body in authentication.logoutUser', error)
							res.status(500)
							res.send()
							return
						}

						res.status(200)
						res.send(body)
						return
					}
					if (response.status === 400) {
						res.status(400)
						res.send()
						return
					}
					if (response.status === 404) {
						res.status(404)
						res.send()
						return
					}

					console.log('Unsupported response in authentication.logoutUser', response)
					res.status(500)
					res.send()
				}).catch(function (error) {
					console.error('Unexpected error in authentication.logoutUser', error.stack || error)
					res.status(500)
					res.send()
				})
			} catch (error) {
				/* Catch validation errors */
				res.status(400)
				res.send(error)
			}
		}
	)

	app.post(
		'/register',
		function (req, res) {
			try {
				function __body() {
					const __contentType = req.get('Content-Type')
					const __mimeType = __contentType ? __contentType.replace(/;.*/, '') : undefined

					if (__mimeType === 'application/json') {
						return v.modelApiUserFromJson('body', req.body)
					}
					console.error(`Invalid request content type: ${__contentType}`)
					throw new Error(`Invalid request content type: ${__contentType}`)
				}

				impl.registerUser(__body()).then(function (response) {
					if (response.status === 201) {
						let body: any
						try {
							body = v.modelApiUserToJson('response', response.body)
						} catch (error) {
							console.error('Invalid response body in authentication.registerUser', error)
							res.status(500)
							res.send()
							return
						}

						res.status(201)
						res.send(body)
						return
					}
					if (response.status === 400) {
						res.status(400)
						res.send()
						return
					}
					if (response.status === 409) {
						res.status(409)
						res.send()
						return
					}

					console.log('Unsupported response in authentication.registerUser', response)
					res.status(500)
					res.send()
				}).catch(function (error) {
					console.error('Unexpected error in authentication.registerUser', error.stack || error)
					res.status(500)
					res.send()
				})
			} catch (error) {
				/* Catch validation errors */
				res.status(400)
				res.send(error)
			}
		}
	)

}
