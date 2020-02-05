<template>
    <article-view-list title="制度信息列表" categoryId="282737714280374276" :enableKnow="true"></article-view-list>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import ArticleViewList from "@/views/cms/ArticleViewList"

export default {
	name:   'SystemInformation',
    extends: Base,
    components: {
        ArticleViewList
    },
    data () {
        return {
            
        }
    },
}
</script>