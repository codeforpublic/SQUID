//
//  ViewController.swift
//  contacttracer
//
//  Created by Sittiphol Phanvilai on 29/3/2563 BE.
//  Copyright © 2563 Sittiphol Phanvilai. All rights reserved.
//

import UIKit
import CoreBluetooth

class ViewController: UIViewController, CBCentralManagerDelegate {
    
    private var centralManager : CBCentralManager!
    
    let kDataClass = CBUUID(string: "86E1");

    @IBOutlet weak var cbAdvertiser: UISwitch!
    @IBOutlet weak var tvStatus: UITextView!
    @IBOutlet weak var btnStartScanning: UIButton!
    @IBOutlet weak var btnStopScanning: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        centralManager = CBCentralManager(delegate: self, queue: nil, options: nil)
    }

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
            if let data = adData[kDataClass] as? NSData {
                print("Ad Data: \(adData)")
                let str = String(data: data as! Data, encoding: .utf8) as! String
                print("str: \(str)")
                
                appendStatusText(text: "\n")
                appendStatusText(text: "RSSI: \(RSSI)")
                appendStatusText(text: "Found Nearby Device: \(str)")
            }
        }
    }
    
    @IBAction func onStartScanningClicked(_ sender: Any) {
        btnStartScanning.isHidden = true
        btnStopScanning.isHidden = false
        
        if centralManager.isScanning {
          return
        }

        appendStatusText(text: "Start Scanning for Nearby Device\n")

        var uuid = CBUUID(string: "000086e1-0000-1000-8000-00805f9b34fb")
        centralManager.scanForPeripherals(withServices: [uuid], options: nil)
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
    
    
    private func appendStatusText(text: String) {
        tvStatus.text = text + "\n" + tvStatus.text
    }

}

