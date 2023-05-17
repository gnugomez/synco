import { consola } from 'consola'

chrome.runtime.onInstalled.addListener(() => {
  consola.info('Extension loaded successfully')
  chrome.action.onClicked.addListener((tab) => {
    consola.info('Extension button clicked')

    if (tab.id) {
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['./main.css']
      })
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['./main.js']
      })
    }
  })
})
