---
title: Sitecore Web Forms for Marketers Custom Sequential Number Field
author: Wesley Lomax
type: post
date: 2016-10-21T10:55:16.000Z
url: /2016/10/21/web-forms-for-marketers-custom-sequential-number-field/
featured_image: http://blog.wesleylomax.co.uk/wp-content/uploads/2016/10/pay-937882_1920.jpg
categories:
  - Sitecore
  - Web Forms For Marketers
tags:
  - Sitecore 8 Update 4
  - WFFM
templateKey: blog-post
---
I had a requirement to implement sequentially numbered WFFM form submissions to identify submissions, email address would not do as we anticipated multiple applications per email. Nothing out of the box supported this requirement so I created my own. <a href="https://twitter.com/nsgocev" target="_blank">Nikola&#8217;s</a> blog post <https://sitecorecorner.com/2015/06/30/wffm-session-aware-single-line-text-field/>  pointed me in the right direction. My example was created using WFFM version 8.0 150625 and Sitecore version 8.0 (rev. 150621).

Here is what I did :-

Created a class with options to define how the field would look in Forms Designer, I have properties for which number sequence will be used, the size of padding to be applied and whether the field will be displayed.

<pre class="brush: csharp; title: ; notranslate" title="">using System.ComponentModel;
using System.ComponentModel.Design;
using Sitecore.Configuration;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Form.Core.Attributes;
using Sitecore.Form.Web.UI.Controls;
using Sitecore.SecurityModel;

namespace WesleyLomax.WFFM
{
    [Designer("System.Windows.Forms.Design.ParentControlDesigner, System.Design", typeof(IDesigner))]
    public class SequentialNumber : SingleLineText
    {
        private bool _isHidden = true;
        private string _sequentialNumberId;
        private int _numberPadding;

        [VisualCategory("Sequence")]
        [VisualFieldType(typeof(Fields.SequentialNumberField))]
        [VisualProperty("Sequence:", 100)]
        public string SequentialNumberId
        {
            get { return _sequentialNumberId; }
            set { _sequentialNumberId = value; }
        }

        [VisualCategory("Sequence")]
        [VisualProperty("Length:", 200), DefaultValue("6")]
        public int NumberPadding
        {
            get { return _numberPadding; }
            set { _numberPadding = value; }
        }

        [VisualCategory("Sequence")]
        [VisualFieldType(typeof(Sitecore.Form.Core.Visual.BooleanField))]
        [VisualProperty("Hidden:", 300), DefaultValue("Yes")]
        public string IsHidden
        {
            get { return _isHidden ? "Yes" : "No"; }
            set { _isHidden = value == "Yes"; }
        }        
    }
}
</pre>

Created a custom  Field Type called **SequentialNumberField** this class will read the values of sequences being held in Sitecore, this is the type of the **SequentialNumberId** property from the **SequentialNumber** class.

<pre class="brush: csharp; title: ; notranslate" title="">using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Form.Core.Configuration;
using Sitecore.Form.Core.Visual;

namespace WesleyLomax.WFFM.Fields
{
    public class SequentialNumberField : ValidationField
    {
        private static readonly ID SequentialFormNumbers = new ID("{C7FB3754-A0B1-469C-9591-7CE3DC075272}");

        public SequentialNumberField() : base(HtmlTextWriterTag.Select.ToString())
        {
        }

        public override bool IsCacheable =&gt; false;

        private static Item SequentialFormNumbersRoot =&gt; StaticSettings.ContextDatabase.GetItem(SequentialFormNumbers);

        protected override void OnPreRender(object sender, EventArgs ev)
        {
            Controls.Clear();
            base.OnPreRender(sender, ev);
            Controls.Add(new Literal
            {
                Text = string.Format("&lt;option {0} value='{1}'&gt;{1}&lt;/option&gt;", DefaultValue == EmptyValue ? "selected='selected'" : string.Empty, EmptyValue)
            });
            foreach (Item child in SequentialFormNumbersRoot.Children)
                Controls.Add(new Literal
                {
                    Text =
                        string.Format("&lt;option {0} value='{1}'&gt;{2}&lt;/option&gt;",
                            DefaultValue == child.Fields[FieldIDs.MetaDataListItemValue].Value ? "selected='selected'" : string.Empty,
                            child.ID.ToShortID(),
                            child.DisplayName)
                });
        }
    }
}
</pre>

&nbsp;

I have added a new folder in the WFFM Meta Data here **/sitecore/system/Modules/Web Forms for Marketers/Settings/Meta data/Sequential Form Numbers** that will hold a list of all the custom sequences in use for WFFM and their current values. The **SequentialFormNumbers** variable holds the folder ID located there so I can render the children in to Forms Designer for selection by the user, you&#8217;d need to update this GUID to you the value from your folder.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Number-Sequences.png" data-rel="lightbox-image-0" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-508" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Number-Sequences.png?resize=640%2C332" alt="number-sequences" width="640" height="332" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Number-Sequences.png?w=1248 1248w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Number-Sequences.png?resize=300%2C156 300w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Number-Sequences.png?resize=768%2C399 768w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Number-Sequences.png?resize=1024%2C532 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

The final class is the **SequentialNumberField** this is the MVC Type WFFM will use to render the and populate the field.

<pre class="brush: csharp; title: ; notranslate" title="">using System;
using Sitecore.Configuration;
using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Forms.Mvc.Models.Fields;
using Sitecore.SecurityModel;

namespace WesleyLomax.WFFM.MVCModels
{
    public class SequentialNumberField : SingleLineTextField
    {
        public SequentialNumberField(Item item) : base(item)
        {
            Initialize();
        }
        public override object Value { get; set; }

        private void Initialize()
        {
            string isHidden = Sitecore.Forms.Mvc.Extensions.DictionaryExtensions.GetValue(ParametersDictionary, "isHidden");

            if (!string.IsNullOrWhiteSpace(isHidden) && isHidden.ToUpper() == "YES")
            {
                if (!string.IsNullOrWhiteSpace(CssClass))
                {
                    CssClass += " hidden";
                }
                else
                {
                    CssClass = "hidden";
                }
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(CssClass))
                {
                    CssClass += " disabled";
                }
                else
                {
                    CssClass = "disabled";
                }
            }

            string sequentialNumberId = Sitecore.Forms.Mvc.Extensions.DictionaryExtensions.GetValue(ParametersDictionary, "sequentialNumberId");

            if (!string.IsNullOrWhiteSpace(sequentialNumberId) && ShortID.IsShortID(sequentialNumberId))
            {
                ID id = ShortID.DecodeID(sequentialNumberId);

                if (!id.IsNull)
                {
                    Database master = Factory.GetDatabase("master");

                    if (master != null)
                    {
                        Item sequenceItem = master.GetItem(id);

                        string number = sequenceItem.Fields[Sitecore.Form.Core.Configuration.FieldIDs.MetaDataListItemValue].Value;
                        int padding = Convert.ToInt32(Sitecore.Forms.Mvc.Extensions.DictionaryExtensions.GetValue(ParametersDictionary, "numberPadding"));

                        int currentNumber;

                        if (int.TryParse(number, out currentNumber))
                        {
                            currentNumber++;

                            string sequence = currentNumber.ToString().PadLeft(padding, '0');

                            Value = sequence;
                            

                            using (new SecurityDisabler())
                            {
                                sequenceItem.Editing.BeginEdit();
                                sequenceItem.Fields[Sitecore.Form.Core.Configuration.FieldIDs.MetaDataListItemValue].Value = sequence;
                                sequenceItem.Editing.EndEdit();
                            }
                        }
                    }
                }
            }
        }
    }
}
</pre>

Here I am reading the values from the **ParametersDictionary** set in Forms Designer and updating the field before it is rendered.  The current sequential number is read from Sitecore incremented and wrote back to the **Value** field, with padding for the value read from the **NumberPadding** property**.**

After all the classes are built you will need to add the Custom Field definition here &#8211;** /sitecore/system/Modules/Web Forms for Marketers/Settings/Field Types/Custom** I called mine  Sequential Number

&nbsp;

<a href="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber.png" data-rel="lightbox-image-1" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-510" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber.png?resize=473%2C286" alt="sequentialnumber" width="473" height="286" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber.png?w=473 473w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber.png?resize=300%2C181 300w" sizes="(max-width: 473px) 100vw, 473px" data-recalc-dims="1" /></a>

&nbsp;

With all that built and configured you can now add the new **Sequential Number** Field to your  form.

<a href="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Type-Full.png" data-rel="lightbox-image-2" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-522" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Type-Full.png?resize=640%2C37" alt="sequentialnumber-type-full" width="640" height="37" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Type-Full.png?w=1071 1071w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Type-Full.png?resize=300%2C17 300w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Type-Full.png?resize=768%2C44 768w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Type-Full.png?resize=1024%2C59 1024w" sizes="(max-width: 640px) 100vw, 640px" data-recalc-dims="1" /></a>

&nbsp;

Once added in Forms Designer you will see three options for configuration.

<img class="alignnone size-full wp-image-519" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Options.png?resize=315%2C181" alt="sequentialnumber-options" width="315" height="181" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Options.png?w=315 315w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/SequentialNumber-Options.png?resize=300%2C172 300w" sizes="(max-width: 315px) 100vw, 315px" data-recalc-dims="1" />

&nbsp;

A **Sequence** to chose from which is maintained in Sitecore, having multiple sequences allows multiple forms submissions to be tracked with a sequential number.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Sequences.png" data-rel="lightbox-image-3" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-518" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Sequences.png?resize=310%2C124" alt="sequences" width="310" height="124" srcset="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Sequences.png?w=310 310w, https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Sequences.png?resize=300%2C120 300w" sizes="(max-width: 310px) 100vw, 310px" data-recalc-dims="1" /></a>

&nbsp;

The **Length** field allows you to set the number leading 0&#8217;s to add to the left of the number, so a length of 4 would produce 0001 if the sequence was at 1 and also a **Hidden** option** ** if you want the number to display on the form or not.

&nbsp;

Finally some examples of the new Sequential Number field in action:-

<img class="alignnone size-full wp-image-515" src="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Form-Sequence.png?resize=428%2C139" alt="form-sequence" width="428" height="139" srcset="https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Form-Sequence.png?w=428 428w, https://i2.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Form-Sequence.png?resize=300%2C97 300w" sizes="(max-width: 428px) 100vw, 428px" data-recalc-dims="1" />

Multiple fields with different sequences and padding values.

<a href="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Multiple-Sequences.png" data-rel="lightbox-image-4" data-rl\_title="" data-rl\_caption="" title=""><img class="alignnone size-full wp-image-517" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Multiple-Sequences.png?resize=237%2C247" alt="multiple-sequences" width="237" height="247" data-recalc-dims="1" /></a>

And the value being using in emails to the user who submitted the form.

<img class="alignnone size-full wp-image-513" src="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/AutoResponder.png?resize=314%2C227" alt="autoresponder" width="314" height="227" srcset="https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/AutoResponder.png?w=314 314w, https://i1.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/AutoResponder.png?resize=300%2C217 300w" sizes="(max-width: 314px) 100vw, 314px" data-recalc-dims="1" />

And the team receiving it.

<img class="alignnone size-full wp-image-514" src="https://i0.wp.com/blog.wesleylomax.co.uk/wp-content/uploads/2016/10/Email-to-team.png?resize=288%2C213" alt="email-to-team" width="288" height="213" data-recalc-dims="1" />

As the value is passed through to the Form Reports when viewed or exported the sequential number can be used to identify the form submitted.

&nbsp;

The link to the Gist for this code is [here][1] with better formatting.

&nbsp;

&nbsp;

 [1]: https://gist.github.com/Wesley-Lomax/4577ce5f3a821e46adc67521a55e6748