/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

// Import the controllers we need
import { RangeControl, PanelBody, SelectControl } from '@wordpress/components';

// Import the new custom number_control component
import NumberControl from './components/number-control';

export default function Edit({ attributes, setAttributes }) {


	const { columnCount, columnWidth, columnGap, columnRuleStyle, columnRuleWidth, columnRuleColor, dropCapColor, dropCapSize, boxShadowColor, boxShadow } = attributes;
	const columnStyles = { columnCount, columnWidth, columnGap, columnRuleStyle, columnRuleWidth, columnRuleColor, '--drop-cap-color':dropCapColor, '--drop-cap-font-size': dropCapSize.fontSize,
    '--drop-cap-line-height': dropCapSize.lineHeight, '--box-shadow': boxShadow, '--box-shadow-color': boxShadowColor }

	const ALLOWED_BLOCKS = [ 'core/heading', 'core/paragraph', 'core/image', 'core/media-text', 'core/pullquote', 'core/separator' ];

	const TEMPLATE_PARAGRAPHS = [
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin finibus, lectus non interdum cursus, arcu sapien mollis lacus, et tincidunt odio nisi ut purus. Duis eleifend, magna placerat faucibus tincidunt, orci nulla ornare tortor, eget egestas tortor nunc quis sem. Cras in tortor justo. Nulla consectetur leo vel blandit consectetur. Fusce quis sapien ante. Vestibulum non varius augue, et ultricies urna. Integer hendrerit suscipit nibh.',
		'Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras vestibulum mauris diam. Praesent semper diam a efficitur iaculis. Nullam lacinia augue quis lorem accumsan tempus. Maecenas dapibus velit eu blandit pretium. Nullam posuere ut ipsum in commodo. Fusce fringilla quis turpis a placerat. Etiam hendrerit velit a lacus varius ornare.',
	]

	const MC_TEMPLATE = [
		[ 'core/heading', { level: 2, placeholder: __('Heading...', 'multi-columns') } ],
		[ 'core/paragraph', { placeholder: TEMPLATE_PARAGRAPHS[0] } ],
		[ 'core/heading', { level: 4, placeholder: __('Sub-Heading...', 'multi-columns') } ],
		[ 'core/paragraph', { placeholder: TEMPLATE_PARAGRAPHS[1] } ],
	]

	const onChangeShadowBoxSize = ( val ) => {
		let boxShadow;
		switch ( val ) {
		  case 'small':
			boxShadow = '5px 5px 2px 0px';
			break;
		  case 'medium':
			boxShadow = '10px 10px 5px 1px';
			break;
		  case 'large':
			boxShadow = '20px 20px 10px 5px';
			break;
		  default:
			boxShadow = '5px 5px 2px 0px';
		}
		setAttributes({
			boxShadow: boxShadow,
		  });
	  };


	const onChangeDropCapSize = ( val ) => {
		switch ( val ) {
			case 'small':
				setAttributes( {
					dropCapSize: {
						size: 'small',
						fontSize: '3.8rem',
						lineHeight: '3.5rem',
					},
				} );
				break;
			case 'medium':
				setAttributes( {
					dropCapSize: {
						size: 'medium',
						fontSize: '4.8rem',
						lineHeight: '4.2rem',
					},
				} );
				break;
			case 'large':
				setAttributes( {
					dropCapSize: {
						size: 'large',
						fontSize: '6.2rem',
						lineHeight: '5.2rem',
					},
				} );
				break;
			case 'xlarge':
				setAttributes( {
					dropCapSize: {
						size: 'xlarge',
						fontSize: '8.8rem',
						lineHeight: '7.2rem',
					},
				} );
				break;
			default:
				setAttributes( {
					dropCapSize: {
						size: 'small',
						fontSize: '3.8rem',
						lineHeight: '3.5rem',
					},
				} );
		}
	};

	return (
		<>
		<InspectorControls>
			<PanelBody title={__('Column Settings', 'multi-columns')}>
				<RangeControl
					label={__("Columns", 'multi-columns')}
					value={ columnCount }
					onChange={ ( columnCount ) => setAttributes( { columnCount } ) }
					min={ 2 }
					max={ 6 }
				/>
				<NumberControl
					label={__("Column Width", 'multi-columns')}
					value={ columnWidth }
					onChange={ ( columnWidth ) => setAttributes( { columnWidth: Number (columnWidth) } ) }
					min={ 50 }
					max={ 500 }
					step={ 10 }
				/>
				<NumberControl
					label={__("Column Gap", 'multi-columns')}
					value={ columnGap }
					onChange={ ( columnGap ) => setAttributes( { columnGap: Number (columnGap) } ) }
					min={ 10 }
					max={ 100 }
				/>
			</PanelBody>
			<PanelBody title='Column Styles' initialOpen={false}>
				<SelectControl
					label={__("Column Rule Style", 'multi-columns')}
					value={ columnRuleStyle }
					onChange={ ( columnRuleStyle ) => setAttributes( { columnRuleStyle } ) }
					options={ [
						{ label: __('None', 'multi-columns'), value: 'none' },
						{ label: __('Solid', 'multi-columns'), value: 'solid' },
						{ label: __('Dotted', 'multi-columns'), value: 'dotted' },
						{ label: __('Dashed', 'multi-columns'), value: 'dashed' },
						{ label: __('Double', 'multi-columns'), value: 'double'},
						{ label: __('Groove', 'multi-columns'), value: 'groove'},
						{ label: __('Ridge', 'multi-columns'), value: 'ridge'}
					] }
				/>
				<NumberControl
					label={__("Column Rule Width", 'multi-columns')}
					value={ columnRuleWidth }
					onChange={ ( columnRuleWidth ) => setAttributes( { columnRuleWidth: Number (columnRuleWidth) } ) }
					min={ 1 }
					max={ 10 }
				/>
				<PanelColorSettings
					title={__('Column Rule Color', 'multi-columns')}
					colorSettings={ [
						{
							label:__('Seperator Color', 'multi-columns'),
							value: columnRuleColor,
							onChange: ( columnRuleColor ) => setAttributes( { columnRuleColor } ),
						}
					] }
				/>
			</PanelBody>
			{ attributes.className == 'is-style-drop-cap' && (
				<PanelBody title={__('Drop Cap', 'multi-columns')} initialOpen={false}>
					<SelectControl
						label={__("Size", 'multi-columns')}
						onChange={  onChangeDropCapSize }
						value={ dropCapSize.size }
						options={ [
							{ label: __('Small', 'multi-columns'), value: 'small' },
							{ label: __('Medium', 'multi-columns'), value: 'medium' },
							{ label: __('Large', 'multi-columns'), value: 'large' },
							{ label: __('Extra Large', 'multi-columns'), value: 'xlarge' },
						] }
					/>
					<PanelColorSettings
						title={__('Drop Cap Color', 'multi-columns')}
						colorSettings={ [
							{
								label:__('Color', 'multi-columns'),
								value: dropCapColor,
								onChange: ( dropCapColor ) => setAttributes( { dropCapColor } ),
							}
						] }
					/>	
				</PanelBody>

			) }
			{ attributes.className == 'is-style-box-shadow' && (
				<PanelBody title={__('Shadow Box', 'multi-columns')} initialOpen={false}>
					<SelectControl
						label={__("Size", 'multi-columns')}
						onChange={  onChangeShadowBoxSize }
						value={ boxShadow.size }
						options={ [
							{ label: __('Small', 'multi-columns'), value: 'small' },
							{ label: __('Medium', 'multi-columns'), value: 'medium' },
							{ label: __('Large', 'multi-columns'), value: 'large' },
						] }
					/>
					<PanelColorSettings
						title={__('Shadow Box Color', 'multi-columns')}
						colorSettings={ [
							{
								label:__('Color', 'multi-columns'),
								value: boxShadowColor,
								onChange: ( boxShadowColor ) => setAttributes( { boxShadowColor } ),
							}
						] }
					/>
				</PanelBody>
			) }
		</InspectorControls>
		<div { ...useBlockProps( { style: columnStyles }) }>
			<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={MC_TEMPLATE}/>
		</div>
		</>
	);
}
