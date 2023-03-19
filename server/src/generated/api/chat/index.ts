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

export default function(app: Express, impl: t.ChatApi) {
	app.post(
		'/chat',
		function (req, res) {
			try {
				function __body() {
					const __contentType = req.get('Content-Type')
					const __mimeType = __contentType ? __contentType.replace(/;.*/, '') : undefined

					if (__mimeType === 'application/json') {
						return v.modelApiMessageFromJson('body', req.body)
					}
					console.error(`Invalid request content type: ${__contentType}`)
					throw new Error(`Invalid request content type: ${__contentType}`)
				}

				impl.sendMessage(__body()).then(function (response) {
					if (response.status === 200) {
						let body: any
						try {
							body = v.modelApiMessageToJson('response', response.body)
						} catch (error) {
							console.error('Invalid response body in chat.sendMessage', error)
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

					console.log('Unsupported response in chat.sendMessage', response)
					res.status(500)
					res.send()
				}).catch(function (error) {
					console.error('Unexpected error in chat.sendMessage', error.stack || error)
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

	app.get(
		'/chat/:userid',
		function (req, res) {
			try {
				impl.getMessages(v.parseString('params.userid', req.params['userid'])).then(function (response) {
					if (response.status === 200) {
						let body: any
						try {
							body = v.arrayToJson(v.modelApiMessageToJson)('response', response.body)
						} catch (error) {
							console.error('Invalid response body in chat.getMessages', error)
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

					console.log('Unsupported response in chat.getMessages', response)
					res.status(500)
					res.send()
				}).catch(function (error) {
					console.error('Unexpected error in chat.getMessages', error.stack || error)
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