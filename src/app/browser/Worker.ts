import { consola } from 'consola'
import { WorkerActions } from './WorkerActions'

chrome.runtime.onInstalled.addListener(() => {
	consola.info('Extension loaded successfully')
	chrome.action.onClicked.addListener((tab) => {
		consola.info(`Action button clicked on tab ${tab.id}`)
		tab.id
      && chrome.tabs.sendMessage<{ action: WorkerActions }>(tab.id, {
      	action: WorkerActions.INIT_UI_CONTEXT,
      })
	})
})
