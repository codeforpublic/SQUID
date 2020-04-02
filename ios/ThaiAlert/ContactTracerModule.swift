//
//  ContactTracerBridge.swift
//  ContactTracerReact
//
//  Created by Sittiphol Phanvilai on 31/3/2563 BE.
//

import Foundation
import UIKit
import CoreBluetooth
import CoreLocation
import BackgroundTasks

@objc(ContactTracerModule)
class ContactTracerModule: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralManagerDelegate {

  var cbuuid = CBUUID(string: "000086e1-0000-1000-8000-00805f9b34fb")

  private var centralManager : CBCentralManager!
  private var peripheralManager : CBPeripheralManager!
  
  let kDataClass = CBUUID(string: "86E1");
  
  private var bluetoothOnResolve : RCTPromiseResolveBlock?
  
  private var isBluetoothOn = false

  func test() -> Int {
    return 1010
  }
  
  @objc
  func initialize(_ resolve: RCTPromiseResolveBlock,
                    rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve(true)
  }
  
  // MARK: Service
  
  private func _setTracerServiceEnabled(enabled: Bool) {
    UserDefaults.standard.set(enabled, forKey: "tracerServiceEnabled")
  }
  
  private func _isTracerServiceEnabled() -> Bool {
    let tracerServiceEnabled = UserDefaults.standard.bool(forKey: "tracerServiceEnabled")
    return tracerServiceEnabled
  }

  @objc
  func isTracerServiceEnabled(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve(_isTracerServiceEnabled())
  }
  
  @objc
  func enableTracerService(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    _setTracerServiceEnabled(enabled: true)
    startScanning()
    startAdvertising()
    resolve(true)
  }
  
  @objc
  func disableTracerService(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    _setTracerServiceEnabled(enabled: false)
    stopScanning()
    stopAdvertising()
    resolve(true)
  }
  
  private func _refreshTracerServiceStatus() {
    if (_isTracerServiceEnabled()) {
      startScanning()
      startAdvertising()
    } else {
      stopScanning()
      stopAdvertising()
    }
  }
  
  @objc
  func refreshTracerServiceStatus(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) -> Void {
    _refreshTracerServiceStatus()
    resolve(_isTracerServiceEnabled())
  }
  
  // MARK: Bluetooth
  
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
    resolve(isBluetoothOn)
  }
  
  @objc
  func tryToTurnBluetoothOn(_ resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: RCTPromiseRejectBlock) -> Void {
    bluetoothOnResolve = resolve
    if centralManager == nil {
      centralManager = CBCentralManager(delegate: self, queue: nil, options: nil)
    }
    if peripheralManager == nil {
      peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }
  }
  
  // User Id
  
  private func _getUserID() -> String {
    let userId = UserDefaults.standard.string(forKey: "userId")
    if userId == nil {
      return "NOIDIOS"
    }
    return userId!
  }
  
  @objc
  func setUserId(_ userId: String,
                   resolver resolve: RCTPromiseResolveBlock,
                   rejecter reject: RCTPromiseRejectBlock) -> Void {
    UserDefaults.standard.set(userId, forKey: "userId")
    resolve(userId)
  }
  
  @objc
  func getUserId(_ resolve: RCTPromiseResolveBlock,
                   rejecter reject: RCTPromiseRejectBlock) -> Void {
    resolve(_getUserID())
  }
  
  @objc override static func requiresMainQueueSetup() -> Bool {
      return false
  }
  
  // Advertiser
  
  func startAdvertising() {
      if peripheralManager == nil {
        return
      }
      peripheralManager.startAdvertising([CBAdvertisementDataLocalNameKey: _getUserID(), CBAdvertisementDataServiceUUIDsKey: [cbuuid]])
      print("Started Advertising")
      emitAdvertiserMessage(message: "Starting Advertising")
  }
  
  func stopAdvertising() {
      if peripheralManager == nil {
        return
      }
      peripheralManager.stopAdvertising()
      print("Started Advertising")
      emitAdvertiserMessage(message: "Stopping Advertising")
  }
  
  // Scanner
  
  private func startScanning() {
    if centralManager == nil {
      return
    }
    emitAdvertiserMessage(message: "Start Scanning for Nearby Device\n")
    centralManager.scanForPeripherals(withServices: [cbuuid], options: nil)
  }

  private func stopScanning() {
    if centralManager == nil {
      return
    }
    emitAdvertiserMessage(message: "Stop Scanning for Nearby Device\n")
    centralManager.stopScan()
  }
 
  // Delegate
  
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    if central.state == .poweredOn {
      print("Bluetooth is On")
      emitAdvertiserMessage(message: "Bluetooth is On. You can start scanning now.")
      bluetoothOnResolve!(true)
    } else {
      print("Bluetooth is not active")
      emitAdvertiserMessage(message: "Bluetooth is not active. Scanning function is disabled.")
      bluetoothOnResolve!(false)
    }
  }
  
  public func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
      if let adData = advertisementData["kCBAdvDataServiceData"] as? AnyObject {
          var nearbyDeviceUserId: String?
          
          let data = adData[kDataClass] as? NSData
          if data == nil {
              // iOS, use name instead
              nearbyDeviceUserId = peripheral.name
          } else {
              nearbyDeviceUserId = String(data: data as! Data, encoding: .utf8) as! String
          }
        
          emitNearbyDeviceFound(name: nearbyDeviceUserId, rssi: "\(RSSI)")

          print("\nFound Nearby Device: \(nearbyDeviceUserId!)")
          print("RSSI: \(RSSI)")
      }
  }
  
  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    switch peripheral.state {
    case .unknown:
        print("Bluetooth Device is UNKNOWN")
    case .unsupported:
        print("Bluetooth Device is UNSUPPORTED")
    case .unauthorized:
        print("Bluetooth Device is UNAUTHORIZED")
    case .resetting:
        print("Bluetooth Device is RESETTING")
    case .poweredOff:
        print("Bluetooth Device is POWERED OFF")
        isBluetoothOn = false
    case .poweredOn:
        print("Bluetooth Device is POWERED ON")
        isBluetoothOn = true
        emitAdvertiserMessage(message: "Bluetooth Device is POWERED ON. You can start advertising now.")
    @unknown default:
        print("Unknown State")
    }
  }
  
  // Event
  
  @objc override func supportedEvents() -> [String] {
    return ["AdvertiserMessage", "NearbyDeviceFound"]
  }
  
  func emitAdvertiserMessage(message: String?) {
    sendEvent(withName: "AdvertiserMessage", body: ["message": message])
  }
  
  func emitNearbyDeviceFound(name: String?, rssi: String?) {
    sendEvent(withName: "NearbyDeviceFound", body: ["name": name, "rssi": rssi])
  }

}
