/* eslint-disable no-console */
/* eslint-disable complexity */
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Polygon, Marker } from '@react-google-maps/api';
import { SphericalUtil } from 'node-geometry-library';
import { connect } from 'react-redux';
import { addMarker } from '../actions/map';
import { defaultPosition } from '../reducers/map';

const mapStateToProps = (state, _ownProps) => {
    return {
        markers: state.app.markers,
        city: state.app.city
    };
};

export default connect(mapStateToProps)(({ city, markers, dispatch }) => {
    const [path, setPath] = useState(markers);
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);
    const dispatchCallback = useCallback(dispatch);

    useEffect(() => {
        if (city.length > 0) {
            const triangle1 = SphericalUtil.computeOffset(city[0], 25000, 0);
            const triangle2 = SphericalUtil.computeOffset(city[0], 25000, 120);
            const triangle3 = SphericalUtil.computeOffset(city[0], 25000, -120);
            setPath([triangle1, triangle2, triangle3]);
        } else {
            setPath(markers);
        }
    }, [city, markers]);

    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map(latLng => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            dispatchCallback(addMarker(nextPath));
            setPath(nextPath);
        }
    }, [dispatchCallback]);

    const onLoad = useCallback(
        polygon => {
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener('set_at', onEdit),
                path.addListener('insert_at', onEdit),
                path.addListener('remove_at', onEdit)
            );
        },
        [onEdit]
    );

    const onUnmount = useCallback(() => {
        listenersRef.current.forEach(lis => lis.remove());
        polygonRef.current = null;
    }, []);

    return (
        <LoadScript id="script-loader" googleMapsApiKey="" language="en" region="us">
            <GoogleMap mapContainerClassName="App-map" center={path[0] || defaultPosition} zoom={7} version="weekly" on>
                <Polygon
                    editable
                    draggable
                    path={path}
                    onMouseUp={onEdit}
                    onDragEnd={onEdit}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                />
                {path &&
                    path.map((pos, key) => {
                        return <Marker key={key} label={'' + key} position={pos} />;
                    })}
            </GoogleMap>
        </LoadScript>
    );
});
