interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number];
  }
  
  interface GeoJSONPolygon {
    type: 'Polygon';
    coordinates: number[][][];
  }
  
  export interface FarmType {
    farmLandPlotting: GeoJSONPolygon;
    pinFarmLocation: GeoJSONPoint;
    farmName: string;
    area: number;
    isActive: boolean;
    farmerId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  }