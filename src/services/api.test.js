import { searchGeocode } from './api';
// {
//     "items": [
//       {
//         "title": "5 Rue Daunou, 75002 Paris, France",
//         "id": "here:af:streetsection:z42doZW8EyzEiPcuOd5MXB:CggIBCCi-9SPARABGgE1KGQ",
//         "resultType": "houseNumber",
//         "houseNumberType": "PA",
//         "address": {
//           "label": "5 Rue Daunou, 75002 Paris, France",
//           "countryCode": "FRA",
//           "countryName": "France",
//           "state": "Île-de-France",
//           "county": "Paris",
//           "city": "Paris",
//           "district": "2e Arrondissement",
//           "street": "Rue Daunou",
//           "postalCode": "75002",
//           "houseNumber": "5"
//         },
//         "position": {
//           "lat": 48.86926,
//           "lng": 2.3321
//         },
//         "access": [
//           {
//             "lat": 48.86931,
//             "lng": 2.33215
//           }
//         ],
//         "mapView": {
//           "west": 2.33073,
//           "south": 48.86836,
//           "east": 2.33347,
//           "north": 48.87016
//         }
//       }
//     ]
//   }
describe('across entire suite', function () {
    it('specify response for a specific request', async function (done) {
        const items = await searchGeocode();
        expect(items).toBeGreaterThan[0];
        expect(items[0].id).toBe('here:cm:namedplace:23919588');
        expect(items[0].mapView).toBeDefined();
        done();
    });
});
