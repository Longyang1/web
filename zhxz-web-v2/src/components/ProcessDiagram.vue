<template>
    <img :src="url" />
</template>

<script>
import request from '@/utils/request'

export default {
    data() {
        return {
            url: '',
        }
    },
    props: {
        processKey: {
            type: String,
            default: ""
        },
        businessKey: {
            type: String,
            default: ""
        }
    },
    mounted() {
        return new request({
            url: '/workflow/process/diagram',
            method: 'get',
            params: {
                processKey: this.processKey,
                businessKey: this.businessKey
            },
            responseType: 'blob'
        }).then(response => {
            if (response.size == 0) {
                return;
            }
            let reader = new FileReader();
            reader.onload = (e) => {
                this.url = e.target.result || "";
            };
            reader.readAsDataURL(response);
        });
    }
}
</script>