<template>
    <cms-article-list 
        ref="cal" 
        title="通知公告" 
        text="通知公告" 
        categoryId="1" 
        listView="NoticeManagement"
        :simpleMode="true"></cms-article-list>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import CmsArticleList from "@/views/cms/CmsArticleList"

export default {
	name: 'NoticeManagement',
    extends: Base,
    components: {
        CmsArticleList
    },
    data () {
        return {
            
        }
    },
    methods: {
        getPagination: function() {
            return this.$refs.cal.$refs.pagination;
        },
    }
}
</script>