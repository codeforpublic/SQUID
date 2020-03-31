//
//  ViewController.swift
//  contacttracer
//
//  Created by Sittiphol Phanvilai on 29/3/2563 BE.
//  Copyright © 2563 Sittiphol Phanvilai. All rights reserved.
//

import UIKit
import CoreBluetooth
import CoreLocation

class ViewController: UIViewController, CBCentralManagerDelegate, CBPeripheralManagerDelegate {

    var cbuuid = CBUUID(string: "000086e1-0000-1000-8000-00805f9b34fb")

    private var centralManager : CBCentralManager!
    private var peripheralManager : CBPeripheralManager!
    
    let kDataClass = CBUUID(string: "86E1");

    @IBOutlet weak var cbAdvertiser: UISwitch!
    @IBOutlet weak var tvStatus: UITextView!
    @IBOutlet weak var btnStartScanning: UIButton!
    @IBOutlet weak var btnStopScanning: UIButton!
    @IBOutlet weak var sbAdvertiser: UISwitch!
    @IBOutlet weak var tvUserId: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
                
        // Do any additional setup after loading the view.
        tvUserId.text = "ID: \(getUserID())"
        
        centralManager = CBCentralManager(delegate: self, queue: nil, options: nil)
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }
    
    // MARK: Scanning

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == .poweredOn {
            print("Bluetooth is On")
            appendStatusText(text: "Bluetooth is On. You can start scanning now.")
            btnStartScanning.isEnabled = true
        } else {
            print("Bluetooth is not active")
            appendStatusText(text: "Bluetooth is not active. Scanning function is disabled.")
        }
    }
    
    public func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        print("\nName   : \(peripheral.name ?? "(No name)")")
        print("RSSI   : \(RSSI)")

        if let adData = advertisementData["kCBAdvDataServiceData"] as? AnyObject {
            var nearbyDeviceUserId: String?
            
            let data = adData[kDataClass] as? NSData
            if data == nil {
                // iOS, use name instead
                nearbyDeviceUserId = peripheral.name
            } else {
                nearbyDeviceUserId = String(data: data as! Data, encoding: .utf8) as! String
            }

            appendStatusText(text: "\n")
            appendStatusText(text: "RSSI: \(RSSI)")
            appendStatusText(text: "Found Nearby Device: \(nearbyDeviceUserId!)")
        }
    }
    
    @IBAction func onStartScanningClicked(_ sender: Any) {
        btnStartScanning.isHidden = true
        btnStopScanning.isHidden = false
        
        if centralManager.isScanning {
          return
        }

        appendStatusText(text: "Start Scanning for Nearby Device\n")

        centralManager.scanForPeripherals(withServices: [cbuuid], options: nil)
    }
    
    @IBAction func onStopScanningClicked(_ sender: Any) {
        btnStartScanning.isHidden = false
        btnStopScanning.isHidden = true
        
        if !centralManager.isScanning {
            return
        }
        
        appendStatusText(text: "Stop Scanning for Nearby Device\n")

        centralManager.stopScan()
    }
    

    // MARK: Advertising
    
    @IBAction func onAdvertiserSwitchChanged(_ sender: Any) {
        if sbAdvertiser.isOn {
            startAdvertising()
        } else {
            stopAdvertising()
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
        case .poweredOn:
            print("Bluetooth Device is POWERED ON")
            appendStatusText(text: "Bluetooth Device is POWERED ON. You can start advertising now.")
            sbAdvertiser.isEnabled = true
        @unknown default:
            print("Unknown State")
        }
    }
    
    func startAdvertising() {
        peripheralManager.startAdvertising([CBAdvertisementDataLocalNameKey: getUserID(), CBAdvertisementDataServiceUUIDsKey: [cbuuid]])
        print("Started Advertising")
        appendStatusText(text: "Starting Advertising")
    }
    
    func stopAdvertising() {
        peripheralManager.stopAdvertising()
        print("Started Advertising")
        appendStatusText(text: "Stopping Advertising")
    }
    
    // MARK: User ID
    
    func getUserID() -> String {
        var userId = UserDefaults.standard.string(forKey: "userId")
        if userId == nil {
            userId = NanoID.new(20)
            UserDefaults.standard.set(userId, forKey: "userId")
        }
        return userId!
    }
    
    // MARK: Status

    private func appendStatusText(text: String) {
        tvStatus.text = text + "\n" + tvStatus.text
    }

}

