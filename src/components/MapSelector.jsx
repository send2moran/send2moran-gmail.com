import React from 'react';
import { If, Then, Else } from 'react-if';
import { connect } from 'react-redux';
import MapGoogle from './MapGoogle';
import MapBing from './MapBing';

const mapStateToProps = (state, _ownProps) => {
    return {
        mapType: state.app.mapType
    };
};

export default connect(mapStateToProps)(({ mapType }) => {
    return (
        <If condition={mapType === 'google'}>
            <Then>
                <MapGoogle />
            </Then>
            <Else>
                <MapBing />
            </Else>
        </If>
    );
});
