<template>
    <cms-article-list 
        ref="cal" 
        title="制度信息" 
        text="制度信息" 
        categoryId="282737714280374276" 
        listView="SystemInformationManagement"
        taskName="复核"
        process-key="SYSTEM_INFORMATION_PUBLISH"
        :enableKnow="true"
        :simpleMode="true"></cms-article-list>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import CmsArticleList from "@/views/cms/CmsArticleList"

export default {
	name: 'SystemInformationManagement',
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