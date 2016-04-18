
var bpm = 92;
var beatLength = 1/92*60 * 1000;

var channels = [
    {name:"lead",numSounds:2},
    {name:"bass",numSounds:3},
    {name:"drum",numSounds:3},
    {name:"kick",numSounds:3},
]

for(var i = 0; i < channels.length; i++)
{
    var channel = channels[i];
    channel.sounds = [];
    channel.id = null;
    channel.currentSound = -1;
    channel.switchTo = function(j)
        {
            if(j != this.currentSound)
            {
                if(this.currentSound >= 0)
                {
                    this.sounds[this.currentSound].fadeOut(0,100,function(self){self.sounds[self.currentSound].stop()}(this));
                }
                this.currentSound = j;
                if(this.currentSound >= this.sounds.length)
                {
                    this.currentSound = 0;
                }
                if(this.currentSound >= 0)
                {
                    var id = this.sounds[this.currentSound].play('sound');
                    this.id = id;
                    this.sounds[this.currentSound].volume(0,id);
                    this.sounds[this.currentSound].fadeIn(1,300);
                }
            }
        }
    channel.sync = function(currentTime)
    {
        if(this.currentSound >= 0)
        {
            this.sounds[this.currentSound].pos(((currentTime + 50) % (beatLength*16)/1000),this.id);
        }
    }
    for(var j = 1; j < channel.numSounds + 1; j++)
    {
        var filename = "assets/" + channel.name + j;
        var sound = new Howl({
          urls: [filename + '.mp3', filename + '.ogg', filename + '.wav'],
          sprite: {
            sound: [0, beatLength*16, true],
          }
          // loop: true,
          // autoplay: true,
          // volume: 0.5,
          // onend: function() {
          //   alert('Finished!');
          // }
        });
        channel.sounds.push(sound);
    }
}
