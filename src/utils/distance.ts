export const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0
    } else {
        var rad_lat1 = Math.PI * lat1 / 180
        var rad_lat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var rad_theta = Math.PI * theta / 180
        var dist = Math.sin(rad_lat1) * Math.sin(rad_lat2) + Math.cos(rad_lat1) * Math.cos(rad_lat2) * Math.cos(rad_theta)
        if (dist > 1) {
            dist = 1
        }
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        dist = dist * 1.609344 // convert to kilometers
        return dist
    }
};