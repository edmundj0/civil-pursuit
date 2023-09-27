import React from 'react';
import Common from './common';

import CafeIdea from "../app/components/type-components/cafe-idea"
// import AskItemWhy from "../app/components/type-components/ask-item-why"
// import AskWebRTC from "../app/components/type-components/ask-webrtc"

export default {
    component: CafeIdea,
    decorators: [
        Story => (
            <div style={Common.outerStyle}>
                {Common.outerSetup()}
                <Story />
            </div>
        )
    ]
}

const parent = {
    _id: "123456789abcdef123556789",
    subject: "This is the Questions",
    description: "There are questions we need to ask, and respectfully discuss.",
    type: "123456789abcdef123556789"
}

const ideaType = {
    "_id": "56ce331e7957d17202e996d6",
    "name": "Intro",
    "harmony": [],
    "id": "9okDr",
    "mediaMethod": "disabled",
    "referenceMethod": 'disabled'
}

export const CafeIdeaStory = () => (
    <div>test</div>
  );
