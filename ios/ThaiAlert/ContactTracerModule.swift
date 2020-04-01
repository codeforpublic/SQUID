//
//  ContactTracerBridge.swift
//  ContactTracerReact
//
//  Created by Sittiphol Phanvilai on 31/3/2563 BE.
//

import Foundation

@objc(ContactTracerModule)
class ContactTracerModule: NSObject {

  @objc
  func isTracerServiceEnabled(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(true)
  }
  
  @objc
  func enableTracerService(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(true)
  }
  
  @objc
  func disableTracerService(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(true)
  }
  
  @objc
  func refreshTracerServiceStatus(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(true)
  }
  
  @objc
  func isBLEAvailable(_ resolve: RCTPromiseResolveBlock,
                        rejecter reject: RCTPromiseRejectBlock) -> Void {
    // on iOS, it is always true
    resolve(true)
  }
  
  @objc
  func isMultipleAdvertisementSupported(_ resolve: RCTPromiseResolveBlock,
                                          rejecter reject: RCTPromiseRejectBlock) -> Void {
    // on iOS, it is always true
    resolve(true)
  }
  
  @objc
  func isBluetoothTurnedOn(_ resolve: RCTPromiseResolveBlock,
                             rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(true)
  }
  
  @objc
  func tryToTurnBluetoothOn(_ resolve: RCTPromiseResolveBlock,
                              rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(true)
  }
  
  @objc
  func setUserId(_ userId: String,
                   resolver resolve: RCTPromiseResolveBlock,
                   rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve(userId)
  }
  
  @objc
  func getUserId(_ resolve: RCTPromiseResolveBlock,
                   rejecter reject: RCTPromiseRejectBlock) -> Void {
    // TODO: Implement
    resolve("NOID")
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return false
  }
  
}
