'use strict';

var dwhoStreams = [];

var currentChannelsList;

function processStreamsList(channelsList) {
    for (var i = 0; i < channelsList.streams.length; i++) {
        // console.log(channelsList.streams[i].channel.name);
        if (channelsList.streams[i].channel.status.startsWith('#dwho')) {
            dwhoStreams.push(channelsList.streams[i]);
        };
    }
}

$.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/search/streams?limit=100&query=madden',
    // url: 'https://api.twitch.tv/kraken/search/channels?query=madden',
    // url: 'https://api.twitch.tv/kraken/search/streams?query=unravel',
    // url: 'https://api.twitch.tv/kraken/streams?limit=100',
    // url: 'https://api.twitch.tv/kraken/search/channels?query=%23',

    headers: {
        'Client-ID': 'v7mgsvgyfzdfvbm2p6wpgtxrpfyxbh',
    },
    success: function(channelsList) {
        console.log(channelsList);
        currentChannelsList = channelsList;

        // while (currentChannelsList.streams.length != 0) {
        for (var i = 0; i < Math.round(currentChannelsList._total / 100); i++) {
            processStreamsList(currentChannelsList);
            $.ajax({
                type: 'GET',
                url: currentChannelsList._links.next,
                async: false,

                headers: {
                    'Client-ID': 'v7mgsvgyfzdfvbm2p6wpgtxrpfyxbh',
                },
                success: function(channelsList) {
                    console.log('hi');
                    console.log(channelsList);
                    currentChannelsList = channelsList;
                    console.log(currentChannelsList);
                    return currentChannelsList;
                }
            })
        }

        console.log(dwhoStreams);

        dwhoStreams.forEach(function(stream) {
            var dwhoStreamUsername = stream.channel.name;

            var streamListString = $(`
                <li>
                    <input type="checkbox">
                    ${dwhoStreamUsername}
                </li>
            `);

            $('ul#active-streams-list').append(streamListString);
        });

        dwhoStreams.forEach(function(stream) {
            console.log(stream.channel.name);
            var dwhoStreamUsername = stream.channel.name;

            var streamDisplayerString = $(`
                <div class="stream-display-section">
                <div id="1"></div>
                <script type="text/javascript">
    	            var options = {
    		            width: 500,
    	                height: 250,
    	                channel: "${dwhoStreamUsername}",
    	            };
                    var player = new Twitch.Player("1", options);
    	            player.setVolume(0.5);
                </script>
                </div>
            `);

            $('ul#stream-display-canvas').append(streamDisplayerString);

        });
    }
});
