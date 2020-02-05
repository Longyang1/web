export default {
    filters: {

    },
    props: {
        data: {
            type: Array,
            default: () => {
                return [];
            }
        },
        avg: {
            type: [Number, String],
            default: -1
        }
    },
    computed: {
        dataEmpty() {
            if (this.data) {
                return this.data.length <= 0;
            }
            return true;
        }
    },
    watch: {
        data: function() {
            this.$set(this.chartData, 'rows', this.handlerData(this.data, this.text, this.count));
        },
    },
    methods: {
        handlerData: function(data, text, count) {
            var arr = [];
            data.forEach(element => {
                var item = {};
                item[text] = element.text;
                item[count] = Number(element.count);
                arr.push(item)
            });
            return arr;
        }
    }
}