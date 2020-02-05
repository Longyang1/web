<template>
    <article-view-list title="信联动态" categoryId="337873240252129280"></article-view-list>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import ArticleViewList from "@/views/cms/ArticleViewList"

export default {
	name: 'XlkhNews',
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