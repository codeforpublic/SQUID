package com.contacttracerreact.utils;

import java.nio.ByteBuffer;

public class ByteUtils {

    public static int byteArrayToInt(byte[] data) {
        int value = 0;
        for (int i = 0; i < 4; i++) {
            int shift = (4 - 1 - i) * 8;
            value += (data[i] & 0x000000FF) << shift;
        }
        return value;
    }

    public static byte[] intToByteArray(int a) {
        return ByteBuffer.allocate(4).putInt(a).array();
    }

}
