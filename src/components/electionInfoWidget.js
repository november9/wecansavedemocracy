import React, { Component } from 'react';

class ElectionInfoWidget extends Component {

  render() {
    vit.load({
      modal: true,
      officialOnly: false,
      width: '100%',
      height: '480px',
      colors: {
        'header': '#229acd',
        'landscapeBackgroundHeader': '#228a9d'
      },
      language: 'en',
    });

    return (
      <div id="_vit"></div>
    )
  }
}

export default ElectionInfoWidget;
