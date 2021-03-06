var soundManager = {};


/**
*	CONSTANTS
*/
soundManager.MUSIC_FILES_PATH = 'music/';
soundManager.MUSICS_LIST = ['main_theme'];
soundManager.SOUNDS_LIST = {
	mainButton: 'main_button',
	button: 'button',
	hammer: 'hammer',
	saw: 'saw',
	chainsaw: 'chainsaw'
};
soundManager.MUSIC_VOLUME = 0.8;
soundManager.SOUND_VOLUME = 1;


/**
*	VARIABLES
*/
soundManager.audioFilesFormat = null;
soundManager.musicTag = null;
soundManager.soundTag = null;


/**
*	Initializes the sound manager.
*/
soundManager.init = function () {
	try {
		this.musicTag = $('audio', '#musicTags')[0];
		this.soundTag = $('audio', '#musicTags')[1];
		
		if(this.musicTag.canPlayType('audio/ogg') != ''){
	        this.audioFilesFormat = '.ogg';
	    } else if(this.musicTag.canPlayType('audio/mp3') != ''){
	        this.audioFilesFormat = '.mp3';
	    }

	    this.musicTag.addEventListener('ended', function () {
	        soundManager.musicTag.src = null;
	        soundManager.playMusic();
	    });

	    this.musicTag.volume = this.MUSIC_VOLUME;
	    this.soundTag.volume = this.SOUND_VOLUME;
	} catch (e) {
	}
}


/**
*	Plays the music.
*/
soundManager.playMusic = function () {
	if (gameManager.musicEnabled && this.audioFilesFormat != null) {
		if (this.musicTag.src == null || this.musicTag.src == '') {
			this.musicTag.src = this.MUSIC_FILES_PATH + 'ms_' +  this.getRandomMusic() + this.audioFilesFormat;
		}
		this.musicTag.play();
	}
}


/**
*	Stops the music.
*/
soundManager.stopMusic = function () {
	if (this.audioFilesFormat != null) {
		this.musicTag.pause();
		this.soundTag.pause();
	}
}


/**
*	Plays a sound.
*/
soundManager.playSound = function (filename) {
	if (gameManager.musicEnabled && this.audioFilesFormat != null) {
		this.soundTag.src = this.MUSIC_FILES_PATH + 'so_' + filename + this.audioFilesFormat;
		this.soundTag.play();
	}
}


/**
*	Picks one random music to play.
*/
soundManager.getRandomMusic = function () {
	return this.MUSICS_LIST[parseInt(Math.random() * this.MUSICS_LIST.length)];
}
