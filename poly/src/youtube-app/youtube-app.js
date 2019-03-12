import { html, PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@polymer/paper-input/paper-input.js";
import "../../node_modules/@polymer/paper-input/paper-textarea.js";
import "../../node_modules/@polymer/paper-radio-button/paper-radio-button.js";
import "../../node_modules/@polymer/paper-radio-group/paper-radio-group.js";
/**
 * @customElement
 * @polymer
 */

class YoutubeApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          width: 80%;
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          margin: 0 auto;
        }
        paper-card {
          text-align: center;
          /* background-image: url(images/giphy3.gif); */
          width: 100%;
          --paper-card-header-color: #fff !important;
        }

        .radio-content {
          text-align: right;
          padding-right: 20px;
          padding-bottom: 15px;
          background: white;
        }
        .card-actions {
          background: white;
        }
        .card-content {
          text-align: left;
          background: white;
        }
        .button {
          width: 100%;
        }
        .radio-icon {
          max-height: 45px;
          background: white;
        }
        .invert {
          filter: invert(100);
        }

      </style>
      <audio autoplay loop>
        <source src="./images/noise.mp3" type="audio/mpeg">
      </audio>
        <paper-card heading="youTubeZcliKZ0R">
        <!-- <img src="/images/giphy2.gif" /> -->
        <div class="card-content">
          <paper-input label="youTubeZ Linkz0r" value="{{link}}"></paper-input>
        </div>
        <div class="card-content">
          <paper-textarea label="account:password" value="{{accinfo}}"></paper-textarea>
        </div>
        <div class="card-content">
          <paper-input label="delay" value="{{time}}"></paper-input>
        </div>
        <div class="radio-content">
          <paper-radio-group selected="{{selected}}">
          Options:
            <paper-radio-button name="Like" value="{{option}}">Like</paper-radio-button>
            <paper-radio-button name="Dislike" value="{{option}}">Dislike</paper-radio-button>
          </paper-radio-group>
        </div>
        <div class="radio-content">
          <paper-radio-group selected="{{headless}}">
          Headless:
            <paper-radio-button name="true" value="{{headless}}">True</paper-radio-button>
            <paper-radio-button name="false" value="{{headless}}">False</paper-radio-button>
          </paper-radio-group>
        </div>

        <div class="card-actions">
          <paper-button class="button" on-click="_fire"><img class="radio-icon invert" src="images/giphy.gif"></paper-button>
        </div>
        </paper-card>
    `;
  }

  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'youtube-app'
      }
    };
  }

  _fire() {
    console.log(this.link, this.accinfo.split('\n'), this.selected, this.headless, this.time);
    var arr = [];
    var accs = this.accinfo.split('\n');

    for (var i = 0; i < accs.length; i++) {
      var details = accs[i].split(':');
      arr.push({
        email: details[0],
        password: details[1]
      });
    }

    console.log(arr);
    const data = {
      link: this.link,
      logins: arr,
      time: parseInt(this.time, 10),
      radio: this.selected,
      headless: this.headless
    };
    const url = 'http://localhost:9000/api/v1/example/example';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response);
      return response.json();
    }).catch(err => {
      console.log(err);
    });
  }

}

window.customElements.define('youtube-app', YoutubeApp);
