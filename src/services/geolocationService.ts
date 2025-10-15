export interface Location {
  lat: number;
  lng: number;
}

export class GeolocationService {
  // Calcular distancia entre dos puntos (Haversine formula)
  static calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(loc2.lat - loc1.lat);
    const dLng = this.deg2rad(loc2.lng - loc1.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(loc1.lat)) * Math.cos(this.deg2rad(loc2.lat)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distancia en km
    
    return distance;
  }

  // Encontrar fixers cercanos
  static findNearbyFixers(userLocation: Location, fixers: any[], maxDistanceKm: number = 5) {
    return fixers.filter(fixer => {
      const fixerLocation = {
        lat: fixer.posicion.lat,
        lng: fixer.posicion.lng
      };
      const distance = this.calculateDistance(userLocation, fixerLocation);
      return distance <= maxDistanceKm;
    });
  }

  // Encontrar ubicaciones cercanas
  static findNearbyUbicaciones(userLocation: Location, ubicaciones: any[], maxDistanceKm: number = 2) {
    return ubicaciones.filter(ubicacion => {
      const ubicacionLocation = {
        lat: ubicacion.posicion.lat,
        lng: ubicacion.posicion.lng
      };
      const distance = this.calculateDistance(userLocation, ubicacionLocation);
      return distance <= maxDistanceKm;
    });
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}