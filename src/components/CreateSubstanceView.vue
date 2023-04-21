<template>
<view-wrapper is-narrow>
    <template v-slot:title>{{ $t('createSubstance.title') }}</template>
    <div>
        <div class="field">
            <label class="label">Name</label>
            <input type="text" v-model="substance.name" @input="substanceChange(substance.name)" class="input" />
            <b-field v-show="!isSubstanceNameCorrect" :type="{'is-danger': true }" :message="errorMessage">
        </div>
        <data-field reference-id="substance.aliases" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
            <label class="label">{{ $t('substance.aliases.label') }}</label>
            <aliases-rw v-model="substance.aliases" v-bind="props" @aliasChange="aliasChanged"></aliases-rw>
        </data-field>
        <data-field reference-id="substance.identifiers" v-slot="props" v-bind="defaultDataFieldProperties" class="field">
            <label class="label">{{ $t('substance.identifiers.label') }}</label>
            <input-identifiers-rw v-model="props.item.identifiers" @identifierCallBack="identifierChanged" v-bind="props" :predefined-keys="identifierKeys" identifier-reference-id="substanceId"></input-identifiers-rw>
            <!-- <input-identifiers-rw v-model="props.item.identifiers" v-bind="props" :predefined-keys="identifierKeys" identifier-reference-id="substanceId"></input-identifiers-rw> -->
        </data-field>
        <div class="field">
            <div class="buttons">
                <button :disabled="!canCreate" class="button is-primary" @click="createNewSubstance(true)">
                    <font-awesome-icon :icon="['fas', 'save']" class="mr-2"></font-awesome-icon>
                    {{ $t('createSubstanceView.create') }}
                </button>
                <button :disabled="!canCreate" class="button is-primary" @click="createNewSubstance(false)">
                    <font-awesome-icon :icon="['fas', 'save']" class="mr-2"></font-awesome-icon>
                    {{ $t('createSubstanceView.createAndMore') }}
                </button>
            </div>

        </div>

</view-wrapper>
</template>

<script>
// import { ValidationObserver } from 'vee-validate';
// import VeeValidate from "vee-validate";
// import { Field, Form } from 'vee-validate';
import {
    Substance
} from '../models/Substance';

export default {
    computed: {
        defaultDataFieldProperties() {
            return {
                showDeveloperInformation: this.showDeveloperInformation,
                isEdit: this.isEditMode,
                item: this.substance,
                noValueDisplayValue: this.defaultNoValueDisplayValue
            }
        },
    },
    props: {
        showDeveloperInformation: {

        },
        defaultNoValueDisplayValue: {

        },
    },
    watch: {

    },
    methods: {
        async createNewSubstance(addNext = false) {
            try {
                this.loading = true;
                let localAliases = [];
                let localIdentifiers = [];
                this.substance.aliases.forEach(element => {
                    if (element.name != '') {
                        localAliases.push(element);
                    }
                });

                this.substance.aliases = localAliases;

                this.substance.identifiers.forEach(element => {
                    if (element.key != undefined && element.value == undefined) {
                        this.canCreate = false;
                        this.$buefy.snackbar.open(this.$t('Identifier has no Value!'));
                    }
                    if (element.key != undefined && element.value != undefined) {
                        localIdentifiers.push(element);
                    }
                });

                if (this.canCreate) {
                    this.substance.identifiers = localIdentifiers;
                    const resp = await this.saveSubstanceService.saveAsync(this.substance);

                    const routeData = {
                        path: `/substances/${this.substance.id}`,
                        query: {
                            isEdit: true
                        }
                    };
                    console.log(routeData);

                    if (!addNext) {

                        this.substance = new Substance();
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: this.$t('createSubstanceView.createSuccess'),
                            type: 'is-success',
                            pauseOnHover: true
                        });
                    } else
                        this.$router.push(routeData);
                }

            } catch (ex) {
                console.error(ex);
                this.$buefy.toast.open({
                    duration: 5000,
                    message: this.$t('createSubstanceView.createUnknownError'),
                    type: 'is-error',
                    pauseOnHover: true
                });
            } finally {
                this.loading = false;
            }
        },
        aliasChanged(val) {
            this.isAliasCorrect = val;
            this.canCreate = this.isAliasCorrect && this.isSubstanceNameCorrect && this.isIdentifierCorrect;
        },
        identifierChanged(val) {
            this.isIdentifierCorrect = val;
            this.canCreate = val && this.isSubstanceNameCorrect && this.isAliasCorrect;
        },
        substanceChange(val) {
            this.errorMessage = this.isSubstanceNameEmpty = val.length < 3 ? "Substanzslänge ist kleine als 3" : "";
            this.canCreate = this.isSubstanceNameCorrect = val.length < 3 ? false : true;

        }
    },
    async created() {
        try {
            let p = [];
            p.push(this.getIdentifiersService.getAsync().then((v) => this.identifierKeys = v));
            await Promise.all(p);
        } catch (ex) {
            console.error(ex);
        }
    },
    // components: {
    // 		ValidationObserver,
    // 		VeeValidate,
    // 		Field,
    // 		Form
    // 		},

    data() {
        return {
            loading: false,
            verification: false,
            users: [],
            aliases: [],
            identifierKeys: [],
            substance: new Substance(),
            isEditMode: true,
            canCreate: false,
            isSubstanceNameCorrect: false,
            errorMessage: null,
            isAliasCorrect: true,
            isIdentifierCorrect: true
        };
    },
    dependencies: [
        'saveSubstanceService',
        'getIdentifiersService'
    ],

}
</script>

<style>

</style>
