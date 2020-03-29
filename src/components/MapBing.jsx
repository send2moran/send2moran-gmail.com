/* eslint-disable complexity */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import { ReactBingmaps } from 'react-bingmaps';
import { If, Then, Else } from 'react-if';

const mapStateToProps = (state, _ownProps) => {
    return {
        markers: state.app.markers,
        city: state.app.city
    };
};

export default connect(mapStateToProps)(({ city, markers }) => {
    const position = city.length > 0 ? Object.values(city[0] || {}) : Object.values(markers[0] || {});
    const key = 'AiUYdzMWcsk73FiVMvGynvn_nj7qmTZxnCAzaZXm_jYlyAa0-EFz7iT-TGZVy5Av';
    return (
        <If condition={city.length > 0}>
            <Then>
                <ReactBingmaps
                    bingmapKey={key}
                    center={position}
                    zoom={7}
                    regularPolygons={[
                        {
                            center: position,
                            radius: 15,
                            points: 3,
                            option: { strokeThickness: 2 }
                        }
                    ]}
                ></ReactBingmaps>
            </Then>
            <Else>
                <ReactBingmaps
                    bingmapKey={key}
                    center={position}
                    zoom={7}
                    irregularPolygons={[
                        {
                            points: markers.map(marker => Object.values(marker)),
                            option: { strokeThickness: 2, color: 'red', withPushPin: true }
                        }
                    ]}
                ></ReactBingmaps>
            </Else>
        </If>
    );
});
