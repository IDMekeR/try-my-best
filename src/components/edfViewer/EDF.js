import React, { Component } from 'react';

function arrayToAscii(array, start, length) {
    var str = '';
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(array[start + i]);
    }
    return str.trim();
}

function flipBits(n) {
    return parseInt(
        n
            .toString(2)
            .split('')
            .map((bit) => 1 - bit)
            .join(''),
        2,
    );
}

class EDF extends Component {
    constructor(uint8array) {
        super();
        var pos = 0;

        var buf = uint8array;
        this.bytes = uint8array;
        var durationMinutes;

        this.header = arrayToAscii(buf, pos, 8);
        pos += 8;
        this.patient = arrayToAscii(buf, pos, 80);
        pos += 80;
        this.info = arrayToAscii(buf, pos, 80);
        pos += 80;
        this.date = arrayToAscii(buf, pos, 8);
        pos += 8;
        this.time = arrayToAscii(buf, pos, 8);
        pos += 8;
        this.header_bytes = arrayToAscii(buf, pos, 8);
        pos += 8;
        this.data_format = arrayToAscii(buf, pos, 44);
        pos += 44;
        this.data_records = parseInt(arrayToAscii(buf, pos, 8));
        pos += 8;
        this.data_record_duration = parseFloat(arrayToAscii(buf, pos, 8));
        pos += 8;
        this.channelCount = parseInt(arrayToAscii(buf, pos, 4));
        pos += 4;

        this.duration = this.data_record_duration * this.data_records;
        this.durationMinutes = this.duration / 60;
        this.bytes_per_sample = this.header === '0' ? 2 : 3;
        this.has_annotations = false;

        var n = this.channelCount;

        this.channels = [];
        for (var i = 0; i < n; i++) {
            var channel = new Object();
            channel.label = arrayToAscii(buf, pos, 16);
            pos += 16;
            channel.data = [];
            if (channel.label.indexOf('DF Annotations') > 0) {
                this.has_annotations = true;
            }
            this.channels.push(channel);
        }

        this.realChannelCount = n;
        if (this.has_annotations) {
            this.realChannelCount--;
        }

        this.annotation_bytes = 0;

        for (let i = 0; i < n; i++) {
            this.channels[i].transducer = arrayToAscii(buf, pos, 80);
            pos += 80;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].dimensions = arrayToAscii(buf, pos, 8);
            pos += 8;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].phys_min = parseInt(arrayToAscii(buf, pos, 8));
            pos += 8;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].phys_max = parseInt(arrayToAscii(buf, pos, 8));
            pos += 8;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].digital_min = parseInt(arrayToAscii(buf, pos, 8));
            pos += 8;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].digital_max = parseInt(arrayToAscii(buf, pos, 8));
            pos += 8;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].prefilters = arrayToAscii(buf, pos, 80);
            pos += 80;
        }

        for (let i = 0; i < n; i++) {
            this.channels[i].num_samples = parseInt(arrayToAscii(buf, pos, 8));
            pos += 8;
            if (this.has_annotations && i === this.realChannelCount) {
                this.annotation_bytes = this.channels[i].num_samples * 2;
            }
        }

        for (let i = 0; i < n; i++) {
            /*edf["channels"][i].reserved = arrayToAscii(buf, pos, 32);*/
            this.channels[i].k = (this.channels[i].phys_max - this.channels[i].phys_min) / (this.channels[i].digital_max - this.channels[i].digital_min);
            pos += 32;
        }

        this.sampling_rate = this.channels[0].num_samples * this.data_record_duration;
        this.sample_size = 0;

        if (this.has_annotations) {
            this.sample_size = (n - 1) * 2 * this.sampling_rate + 60 * 2;
        } else {
            this.sample_size = n * 2 * this.sampling_rate;
        }

        var duration = (buf.length - pos) / this.sample_size;

        this.headerOffset = pos;

        this.samples_in_one_data_record = this.sampling_rate * this.data_record_duration;

        for (var j = 0; j < this.data_records; j++) {
            for (let i = 0; i < this.realChannelCount; i++) {
                var koef = this.channels[i].k;

                for (var k = 0; k < this.samples_in_one_data_record; k++) {
                    if (this.bytes_per_sample === 2) {
                        var b1 = buf[pos];
                        pos++;
                        var b2 = buf[pos];
                        pos++;

                        var val = (b2 << 8) + b1;

                        if (b2 >> 7 === 1) {
                            val = -flipBits(val) - 1;
                        }
                        this.channels[i].data.push(val * koef);
                    } else if (this.bytes_per_sample === 3) {
                        let b1 = buf[pos];
                        pos++;
                        let b2 = buf[pos];
                        pos++;
                        var b3 = buf[pos];
                        pos++;

                        let val = (b3 << 16) + (b2 << 8) + b1;

                        if (b3 >> 7 === 1) {
                            val = -flipBits(val) - 1;
                        }
                        this.channels[i].data.push(val * koef);
                    }
                }
            }
            if (this.has_annotations) {
                var ann = arrayToAscii(buf, pos, this.annotation_bytes);
                pos += this.annotation_bytes;
            }
        }
    }

    readSingleChannel(channel, startSecond, lengthSeconds) {
        var startSample = startSecond * this.sampling_rate;
        var endSample = startSample + lengthSeconds * this.sampling_rate;

        if (endSample > this.maxSample) {
            endSample = this.maxSample;
        }

        var data = [];

        var ch = this.channels[channel].data;
        for (var i = startSample; i < endSample; i++) {
            data.push(ch[i]);
        }

        return data;
    }

    read(startSecond, lengthSeconds) {
        var array = [];

        for (var i = 0; i < this.realChannelCount; i++) {
            array.push(this.readSingleChannel(i, startSecond, lengthSeconds));
        }

        return array;
    }
}

export default EDF;
