import { consola } from 'consola'
import { WorkerActions } from './WorkerActions'

consola.info('Loading worker...')

chrome.action.onClicked.addListener((tab) => {
  consola.info(`Action button clicked on tab ${tab.id}`)
  tab.id &&
    chrome.tabs.sendMessage<{ action: WorkerActions }>(tab.id, {
      action: WorkerActions.INIT_UI_CONTEXT,
    })
})

consola.info('Worker has been loaded')
